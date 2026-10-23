const { listTenants, provisionTenant } = require('../config/tenantManager');

/**
 * Fallback padrão de tenants caso o banco Master ainda não esteja provisionado
 */
const DEFAULT_FALLBACK_TENANTS = [
  { id: 1, slug: 'matriz', name: 'Bibliotech - Matriz Central', db_name: 'bibliotech_tenant_matriz' },
  { id: 2, slug: 'franquia-sp', name: 'Bibliotech - Franquia São Paulo', db_name: 'bibliotech_tenant_franquia_sp' }
];

/**
 * Serviço para gestão de tenants e multi-tenancy (Clean Code)
 */
class TenantService {
  /**
   * Listar todos os tenants ativos
   */
  static async listAll() {
    try {
      const tenants = await listTenants();
      if (tenants && tenants.length > 0) {
        return tenants;
      }
      return DEFAULT_FALLBACK_TENANTS;
    } catch (error) {
      console.warn('[TenantService] Master DB inacessível, utilizando tenants padrão em fallback:', error.message);
      return DEFAULT_FALLBACK_TENANTS;
    }
  }

  /**
   * Provisionar nova empresa / franquia
   */
  static async provision({ name, slug, cnpj }) {
    if (!name || !slug) {
      throw new Error('Nome e slug são obrigatórios para criar uma nova franquia.');
    }

    return await provisionTenant({ name, slug, cnpj });
  }
}

module.exports = TenantService;
