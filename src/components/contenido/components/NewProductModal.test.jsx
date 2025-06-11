import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NewProductModal from './NewProductModal';
import { NotificationProvider } from '../../../context/NotificationContext';

// Mock de fetch para simular respuestas de la API
global.fetch = vi.fn();

// Mock del contexto de notificaciones
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({
    addNotification: vi.fn()
  }),
  NotificationProvider: ({ children }) => <div>{children}</div>
}));

describe('NewProductModal', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock de respuesta para la API de tamaños
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ([
        { id_tamano: 1, nombre: "Personal" },
        { id_tamano: 2, nombre: "Mediana" }
      ])
    });
  });

  test('renders correctly when show is true', async () => {
    render(
      <NotificationProvider>
        <NewProductModal show={true} onClose={() => {}} onSuccess={() => {}} />
      </NotificationProvider>
    );

    expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
    expect(screen.getByText('Datos Básicos del Producto')).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 2')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(
      <NotificationProvider>
        <NewProductModal show={false} onClose={() => {}} onSuccess={() => {}} />
      </NotificationProvider>
    );

    expect(screen.queryByText('Nuevo Producto')).not.toBeInTheDocument();
  });

  test('validates required fields before proceeding to step 2', async () => {
    const mockNotification = vi.fn();
    vi.mock('../../../context/NotificationContext', () => ({
      useNotifications: () => ({
        addNotification: mockNotification
      }),
      NotificationProvider: ({ children }) => <div>{children}</div>
    }));

    render(
      <NotificationProvider>
        <NewProductModal show={true} onClose={() => {}} onSuccess={() => {}} />
      </NotificationProvider>
    );

    // Try to proceed to next step without filling required fields
    fireEvent.click(screen.getByText('Siguiente'));
    
    // Check if validation prevented navigation
    expect(screen.getByText('Paso 1 de 2')).toBeInTheDocument();
  });

  test('shows error notification when submitting without prices', async () => {
    const mockNotification = vi.fn();
    vi.mock('../../../context/NotificationContext', () => ({
      useNotifications: () => ({
        addNotification: mockNotification
      }),
      NotificationProvider: ({ children }) => <div>{children}</div>
    }));

    render(
      <NotificationProvider>
        <NewProductModal show={true} onClose={() => {}} onSuccess={() => {}} />
      </NotificationProvider>
    );

    // Fill required fields in step 1
    fireEvent.change(screen.getByLabelText('Título *'), { target: { value: 'Pizza Test' } });
    fireEvent.change(screen.getByLabelText('Porciones *'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Pizza' } });
    
    const selectElement = screen.getByLabelText('Sección *');
    fireEvent.change(selectElement, { target: { value: 'menu_principal' } });
    
    // Go to step 2
    fireEvent.click(screen.getByText('Siguiente'));
    
    // Check if we moved to step 2
    await waitFor(() => {
      expect(screen.getByText('Precios por Tamaño')).toBeInTheDocument();
    });
    
    // Try to submit without entering prices
    fireEvent.click(screen.getByText('Crear Producto'));
    
    // Check if validation prevented submission
    expect(mockNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' })
    );
  });
});
