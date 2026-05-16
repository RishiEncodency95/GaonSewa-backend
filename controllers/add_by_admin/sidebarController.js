import Sidebar from '../../models/add_by_admin/Sidebar.js';

// Create a new Sidebar item
export const createSidebar = async (req, res) => {
    try {
        const newSidebar = await Sidebar.create(req.body);
        res.status(201).json({ success: true, message: 'Sidebar item added successfully', data: newSidebar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Sidebar items
export const getSidebars = async (req, res) => {
    try {
        const sidebars = await Sidebar.find().sort({ sectionOrder: 1, order: 1 });
        res.status(200).json({ success: true, data: sidebars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a Sidebar item
export const updateSidebar = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSidebar = await Sidebar.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedSidebar) {
            return res.status(404).json({ success: false, message: 'Sidebar item not found' });
        }

        res.status(200).json({ success: true, message: 'Sidebar item updated successfully', data: updatedSidebar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Sidebar item
export const deleteSidebar = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSidebar = await Sidebar.findByIdAndDelete(id);

        if (!deletedSidebar) return res.status(404).json({ success: false, message: 'Sidebar item not found' });
        res.status(200).json({ success: true, message: 'Sidebar item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};