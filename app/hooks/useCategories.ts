'use client';

import { useState, useEffect } from 'react';
import { Category, Tag, DEFAULT_CATEGORIES } from '../types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('todo-categories');
    const savedTags = localStorage.getItem('todo-tags');

    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      setCategories(parsed.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt)
      })));
    } else {
      // Initialize with default categories
      const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }));
      setCategories(defaultCats);
      localStorage.setItem('todo-categories', JSON.stringify(defaultCats));
    }

    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('todo-categories', JSON.stringify(updated));
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(updated);
    localStorage.setItem('todo-categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    setCategories(updated);
    localStorage.setItem('todo-categories', JSON.stringify(updated));
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Math.random().toString(36).substr(2, 9),
    };

    const updated = [...tags, newTag];
    setTags(updated);
    localStorage.setItem('todo-tags', JSON.stringify(updated));
    return newTag;
  };

  const deleteTag = (id: string) => {
    const updated = tags.filter(tag => tag.id !== id);
    setTags(updated);
    localStorage.setItem('todo-tags', JSON.stringify(updated));
  };

  return {
    categories,
    tags,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
  };
}