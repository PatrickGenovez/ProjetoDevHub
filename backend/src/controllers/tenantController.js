const TenantService = require('../services/tenantService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller para endpoints de Tenants / Franquias (Clean Code)
 */
class TenantController {
  /**
   * GET /tenants
   */
  static async list(req, res, next) {
    try {
      const tenants = await TenantService.listAll();
      return ApiResponse.success(res, tenants);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /tenants
   */
  static async provision(req, res, next) {
    try {
      const { name, slug, cnpj } = req.body;
      const newTenant = await TenantService.provision({ name, slug, cnpj });

      return res.status(201).json({
        success: true,
        message: `Empresa "${name}" provisionada com sucesso no banco "${newTenant.db_name}"!`,
        tenant: newTenant
      });
    } catch (error) {
      if (error.message.includes('obrigatórios')) {
        return ApiResponse.badRequest(res, error.message);
      }
      return ApiResponse.error(res, 'Erro ao provisionar nova base para a franquia.', 500, error.message);
    }
  }
}

module.exports = TenantController;
