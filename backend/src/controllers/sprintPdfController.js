const path = require('path');
const fs = require('fs');
const SprintPdfService = require('../services/sprintPdfService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller para geração e download do PDF de Planejamento de Sprints
 */
class SprintPdfController {
  /**
   * GET /sprints-pdf
   */
  static async handlePdf(req, res, next) {
    try {
      const isDownload = req.query.download === 'true';

      if (isDownload) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf"');
        return SprintPdfService.pipeToStream(res);
      }

      // Gera arquivo estático para consulta local caso necessário
      const rootPath = path.resolve(__dirname, '../../../PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf');
      const publicPath = path.resolve(__dirname, '../../../frontend/public/PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf');

      try {
        await SprintPdfService.generateToFile(rootPath);
        if (fs.existsSync(path.dirname(publicPath))) {
          fs.copyFileSync(rootPath, publicPath);
        }
      } catch (fileErr) {
        console.warn('[SprintPdfController] Não foi possível salvar cópia em disco:', fileErr.message);
      }

      return res.json({
        success: true,
        message: 'PDF disponível para consulta e download!',
        rootFile: rootPath,
        publicUrl: 'http://localhost:3000/PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SprintPdfController;
