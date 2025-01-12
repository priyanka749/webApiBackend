const Category = require("../model/Categories"); // Import the Category model

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Create a new category document
        const newCategory = new Category({ name, description });

        // Save the category to the database
        const savedCategory = await newCategory.save();
        res.status(201).json({ message: "Category created successfully", data: savedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ data: category });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
