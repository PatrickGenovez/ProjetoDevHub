const BookService = require('../services/bookService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller para operações do catálogo de livros (Clean Code)
 */
class BookController {
  /**
   * GET /books
   */
  static async getAll(req, res, next) {
    try {
      const { genre, search, page, limit, sort } = req.query;
      const result = await BookService.list({ genre, search, page, limit, sort });

      if (result.isPaginated) {
        return ApiResponse.paginated(res, {
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit
        });
      }

      return ApiResponse.success(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /books
   */
  static async create(req, res, next) {
    try {
      const newBook = await BookService.create(req.body);
      return ApiResponse.created(res, newBook, 'Livro cadastrado com sucesso!');
    } catch (error) {
      if (error.message.includes('obrigatórios')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * PATCH /books/:id/toggle-status
   */
  static async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updatedBook = await BookService.toggleStatus(id);

      if (!updatedBook) {
        return ApiResponse.notFound(res, 'Livro não encontrado.');
      }

      return ApiResponse.success(res, updatedBook, 'Status atualizado com sucesso.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /books/:id
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await BookService.delete(id);

      if (!deleted) {
        return ApiResponse.notFound(res, 'Livro não encontrado.');
      }

      return ApiResponse.success(res, null, 'Livro removido com sucesso.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookController;
