const { getTenantPool, getMasterPool } = require('../config/tenantManager');

const DEFAULT_MATRIZ_TENANT = {
  id: 1,
  slug: 'matriz',
  name: 'Bibliotech - Matriz Central',
  db_name: 'bibliotech_tenant_matriz'
};

/**
 * Extrai o identificador do tenant por ordem de prioridade
 */
function extractTenantSlug(req) {
  return (
    req.headers['x-tenant-slug'] ||
    req.headers['x-tenant-id'] ||
    req.query.tenant ||
    (req.user && req.user.tenant_slug) ||
    'matriz'
  );
}

/**
 * Middleware para identificação dinâmica de Tenant e injeção da conexão correspondente (Multi-tenant)
 */
async function tenantMiddleware(req, res, next) {
  try {
    const tenantSlug = extractTenantSlug(req);

    // 1. Injeta o pool Master para consultas globais se necessário
    req.masterDb = getMasterPool();

    // 2. Resolve dinamicamente o pool de conexão para a base do tenant específico
    const { pool, tenant } = await getTenantPool(tenantSlug);

    req.tenant = tenant;
    req.tenantDb = pool;

    return next();
  } catch (err) {
    console.warn(`[TenantMiddleware] Falha ao carregar tenant solicitado: ${err.message}. Aplicando fallback.`);

    // Fallback gracioso para tenant matriz
    try {
      const { pool, tenant } = await getTenantPool('matriz');
      req.tenant = tenant;
      req.tenantDb = pool;
      return next();
    } catch (fallbackErr) {
      // Modo resiliente offline (não bloqueia servidor)
      req.tenant = DEFAULT_MATRIZ_TENANT;
      req.tenantDb = null;
      return next();
    }
  }
}

module.exports = tenantMiddleware;
