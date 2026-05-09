function joinUrl(base, path) {
  const normalizedBase = (base || '').replace(/\/+$/, '');
  const normalizedPath = (path || '').startsWith('/') ? path : `/${path || ''}`;
  return `${normalizedBase}${normalizedPath}`;
}

function template(str, values) {
  return String(str || '').replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value == null ? '' : String(value);
  });
}

function parsePath(path) {
  const tokens = [];
  const re = /([^[.\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = re.exec(path))) {
    if (match[1] != null) tokens.push(match[1]);
    if (match[2] != null) tokens.push(Number(match[2]));
  }
  return tokens;
}

function getByPath(obj, path) {
  if (!path) return undefined;
  const tokens = parsePath(path);
  let cursor = obj;
  for (const token of tokens) {
    if (cursor == null) return undefined;
    cursor = cursor[token];
  }
  return cursor;
}

function findFirstByKeys(obj, keys) {
  if (obj == null) return undefined;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findFirstByKeys(item, keys);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  if (typeof obj !== 'object') return undefined;

  for (const key of keys) {
    if (obj[key] != null) return obj[key];
  }

  for (const value of Object.values(obj)) {
    const found = findFirstByKeys(value, keys);
    if (found !== undefined) return found;
  }

  return undefined;
}

function toConsoleError(message, status = 502) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function getConfig() {
  return {
    baseUrl: process.env.SOLUSVM_API_BASE_URL,
    apiToken: process.env.SOLUSVM_API_TOKEN,
    authHeader: process.env.SOLUSVM_AUTH_HEADER || 'Authorization',
    authPrefix: process.env.SOLUSVM_AUTH_PREFIX || 'Bearer',
    consolePathTemplate: process.env.SOLUSVM_CONSOLE_PATH_TEMPLATE || '/instances/{instanceId}/console',
    consoleMethod: (process.env.SOLUSVM_CONSOLE_METHOD || 'POST').toUpperCase(),
    consoleUrlField: process.env.SOLUSVM_CONSOLE_URL_FIELD || '',
    lookupEnabled: String(process.env.SOLUSVM_LOOKUP_ENABLED || 'true').toLowerCase() === 'true',
    lookupPathTemplate: process.env.SOLUSVM_LOOKUP_PATH_TEMPLATE || '/instances?search={hostname}',
    lookupMethod: (process.env.SOLUSVM_LOOKUP_METHOD || 'GET').toUpperCase(),
    lookupInstanceIdField: process.env.SOLUSVM_LOOKUP_INSTANCE_ID_FIELD || '',
  };
}

function getConsolePathCandidates(config, values) {
  const configured = (config.consolePathTemplate || '').trim();
  const rawCandidates = configured
    ? [configured]
    : [
        '/instances/{instanceId}/console',
        '/instances/{instanceId}/vnc',
        '/servers/{instanceId}/console',
        '/servers/{instanceId}/vnc',
        '/virtual-machines/{instanceId}/console',
        '/virtual-machines/{instanceId}/vnc',
        '/instances/{instanceId}/remote-access',
      ];

  return [...new Set(rawCandidates.map((path) => template(path, values)))];
}

function getLookupPathCandidates(config, values) {
  const configured = (config.lookupPathTemplate || '').trim();
  const rawCandidates = configured
    ? [configured]
    : [
        '/instances?search={hostname}',
        '/instances?hostname={hostname}',
        '/instances?name={hostname}',
        '/servers?search={hostname}',
        '/servers?hostname={hostname}',
        '/virtual-machines?search={hostname}',
        '/virtual-machines?hostname={hostname}',
      ];

  return [...new Set(rawCandidates.map((path) => template(path, values)))];
}

function buildAuthHeader(config) {
  const prefix = String(config.authPrefix || '').trim();
  if (!prefix) return config.apiToken;
  return `${prefix} ${config.apiToken}`;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();

  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const remoteMessage =
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      `Provider request failed with ${response.status}`;
    throw toConsoleError(remoteMessage, response.status);
  }

  return payload;
}

function normalizeUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^(https?:\/\/|wss?:\/\/)/i.test(trimmed)) return trimmed;
  return null;
}

function extractConsoleUrl(payload, configuredField) {
  const viaPath = normalizeUrl(getByPath(payload, configuredField));
  if (viaPath) return viaPath;

  const viaCommonKeys = normalizeUrl(
    findFirstByKeys(payload, ['console_url', 'novnc_url', 'vnc_url', 'url', 'websocket_url'])
  );
  if (viaCommonKeys) return viaCommonKeys;

  return null;
}

function extractInstanceId(payload, configuredField) {
  const viaPath = getByPath(payload, configuredField);
  if (viaPath != null && String(viaPath).trim()) return String(viaPath);

  const viaCommonKeys = findFirstByKeys(payload, ['instance_id', 'vmid', 'virtual_machine_id', 'id']);
  if (viaCommonKeys != null && String(viaCommonKeys).trim()) return String(viaCommonKeys);

  return null;
}

async function resolveInstanceId(service, config) {
  if (service.external_id && String(service.external_id).trim()) {
    return String(service.external_id).trim();
  }

  if (!config.lookupEnabled) {
    throw toConsoleError('Console provider ID is missing for this service. Set services.external_id for this VPS.', 422);
  }

  const values = {
    hostname: encodeURIComponent(service.hostname || ''),
    serviceId: service.id,
  };

  const lookupPaths = getLookupPathCandidates(config, values);
  let lastLookupError = null;

  for (const lookupPath of lookupPaths) {
    try {
      const lookupUrl = joinUrl(config.baseUrl, lookupPath);
      const lookupPayload = await fetchJson(lookupUrl, {
        method: config.lookupMethod,
        headers: {
          Accept: 'application/json',
          [config.authHeader]: buildAuthHeader(config),
        },
      });

      const instanceId = extractInstanceId(lookupPayload, config.lookupInstanceIdField);
      if (instanceId) return instanceId;
    } catch (err) {
      lastLookupError = err;
    }
  }

  if (lastLookupError) {
    throw toConsoleError(
      `Could not resolve provider instance ID for hostname ${service.hostname}. ${lastLookupError.message}`,
      Number(lastLookupError.status) || 404
    );
  }

  throw toConsoleError(`Could not resolve provider instance ID for hostname ${service.hostname}.`, 404);
}

async function getConsoleUrlForService(service) {
  const config = getConfig();

  if (!config.baseUrl || !config.apiToken) {
    throw toConsoleError('SolusVM console integration is not configured on the server.', 503);
  }

  const instanceId = await resolveInstanceId(service, config);
  const values = {
    instanceId: encodeURIComponent(instanceId),
    serviceId: service.id,
    hostname: encodeURIComponent(service.hostname || ''),
  };

  const consolePaths = getConsolePathCandidates(config, values);
  let lastConsoleError = null;

  for (const consolePath of consolePaths) {
    try {
      const consoleUrl = joinUrl(config.baseUrl, consolePath);
      const consolePayload = await fetchJson(consoleUrl, {
        method: config.consoleMethod,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          [config.authHeader]: buildAuthHeader(config),
        },
      });

      const providerConsoleUrl = extractConsoleUrl(consolePayload, config.consoleUrlField);
      if (providerConsoleUrl) {
        return { providerConsoleUrl, instanceId };
      }
    } catch (err) {
      lastConsoleError = err;
    }
  }

  if (lastConsoleError) {
    throw toConsoleError(
      `Provider console request failed for instance ${instanceId}. ${lastConsoleError.message}`,
      Number(lastConsoleError.status) || 502
    );
  }

  throw toConsoleError('Provider did not return a valid console URL.', 502);
}

module.exports = {
  getConsoleUrlForService,
};
