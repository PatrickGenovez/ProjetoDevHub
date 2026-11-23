const { HTTP_STATUS } = require('../config/constants');

/**
 * Utilitários padronizados para respostas da API REST (Clean Code)
 */
class ApiResponse {
  /**
   * Resposta de sucesso padrão
   */
  static success(res, data = null, message = null, statusCode = HTTP_STATUS.OK) {
    const payload = { success: true };
    if (message) payload.message = message;
    if (data !== null) payload.data = data;
    return res.status(statusCode).json(payload);
  }

  /**
   * Resposta para recursos criados
   */
  static created(res, data = null, message = 'Recurso criado com sucesso!') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Resposta paginada consistente
   */
  static paginated(res, { data = [], total = 0, page = 1, limit = 12 }) {
    const totalPages = Math.ceil(total / limit) || 1;
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      count: data.length,
      data
    });
  }

  /**
   * Resposta de erro padronizada
   */
  static error(res, message = 'Ocorreu um erro interno.', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    const payload = {
      success: false,
      error: message
    };
    if (details) payload.details = details;
    return res.status(statusCode).json(payload);
  }

  /**
   * Erro de requisição inválida (400)
   */
  static badRequest(res, message = 'Parâmetros inválidos.') {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Erro de não autorizado (401)
   */
  static unauthorized(res, message = 'Não autorizado. Acesso negado.') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Erro de não encontrado (404)
   */
  static notFound(res, message = 'Recurso não encontrado.') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }
}

module.exports = ApiResponse;
