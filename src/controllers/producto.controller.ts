import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { ProductoSchema, Producto } from '../types/producto';
import { z } from 'zod';

export const createProducto = async (req: Request, res: Response) => {
  try {
    const validatedData = ProductoSchema.omit({ id: true, created_at: true }).parse(req.body);
    
    const { data, error } = await supabase
      .from('productos')
      .insert(validatedData)
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      message: "Error creating producto", 
      error: (error as Error).message 
    });
  }
};

export const getProductos = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching productos", 
      error: (error as Error).message 
    });
  }
};

export const getProductoById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Producto not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching producto", 
      error: (error as Error).message 
    });
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const validatedData = ProductoSchema.omit({ id: true, created_at: true }).parse(req.body);
    
    const { data, error } = await supabase
      .from('productos')
      .update(validatedData)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "Producto not found" });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      message: "Error updating producto", 
      error: (error as Error).message 
    });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (data === null) {
      return res.status(404).json({ message: "Producto not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting producto", 
      error: (error as Error).message 
    });
  }
};
