import {
  getAllExperiencias,
  getExperienciasByUser,
  getExperienciasByStatus,
  getExperienciaById,
  createExperiencia,
  updateExperiencia,
  updateExperienciaApproval,
  deleteExperiencia
} from './ExperienciasService';

// Mock global fetch
global.fetch = jest.fn();

describe('ExperienciasService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAllExperiencias', () => {
    it('debería obtener todas las experiencias correctamente', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        message: "Todas las experiencias obtenidas exitosamente",
        experiencias: [{ id_experiencia: 1, titulo: "Test" }]
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getAllExperiencias();
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
    
    it('debería manejar errores al obtener experiencias', async () => {
      fetch.mockResolvedValueOnce({
        ok: false
      });
      
      await expect(getAllExperiencias()).rejects.toThrow('Error al obtener las experiencias');
    });
  });
  
  describe('getExperienciasByUser', () => {
    it('debería obtener las experiencias de un usuario específico', async () => {
      const userId = 1;
      const mockResponse = {
        message: "Experiencias del usuario obtenidas exitosamente",
        experiencias: [{ id_experiencia: 1, titulo: "Test" }]
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getExperienciasByUser(userId);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/user/${userId}`));
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('updateExperienciaApproval', () => {
    it('debería actualizar el estado de aprobación de una experiencia', async () => {
      const id = 1;
      const aprobado = 1;
      const mockResponse = {
        message: "Estado de experiencia actualizado exitosamente",
        experiencia: { id_experiencia: 1, aprobado: 1 }
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await updateExperienciaApproval(id, aprobado);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${id}/approval`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ aprobado })
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('deleteExperiencia', () => {
    it('debería eliminar una experiencia correctamente', async () => {
      const id = 1;
      const mockResponse = {
        message: "Experiencia eliminada exitosamente",
        experiencia_eliminada: { id_experiencia: 1 }
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await deleteExperiencia(id);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/${id}`),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
