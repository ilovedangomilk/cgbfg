import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem, Button, Stack, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import InventoryItem from './components/InventoryItem';
import BottomMenuBar from './components/BottomMenuBar';
import RecipeList from './components/RecipeList';
import CameraComponent from './components/Camera';
import ImageUpload from './components/ImageUpload';
import ItemsList from './components/ReceiptItemsList';
import SavedRecipes from './components/SavedRecipes';
import './App.css';
import EditItemForm from './components/EditItemForm'; 
import EditReceiptItem from './components/EditReceiptItem';
import Dashboard from './components/Dashboard.js'
import { apiUrl } from './components/IpAdr'; 
import axios from 'axios';
import Leaderboard from './components/Leaderboard.js';


const Groceries = ({ inventoryItems, onDecrement, onDelete, handleFilterChange, handleSearchChange, searchQuery, fetchInventoryItems, handleSortChange, sortCriterion, selectedFilter }) => (
    <>
        <div className="search-container">
            <InputGroup>
                <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <InputRightElement>
                    <IconButton
                        aria-label="Search database"
                        icon={<SearchIcon />}
                        onClick={handleSearchChange}
                    />
                </InputRightElement>
            </InputGroup>
        </div>
        <div className="filter-container">
            <Stack direction="row" spacing={4} paddingLeft="5px">
                <SortButton handleSortChange={handleSortChange} sortCriterion={sortCriterion} />
                <Button colorScheme={selectedFilter === 'All' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('All')}>All</Button>
                <Button colorScheme={selectedFilter === 'Vegetable' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Vegetable')}>🥦 Vegetable</Button>
                <Button colorScheme={selectedFilter === 'Meat' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Meat')}>🍖 Meat</Button>
                <Button colorScheme={selectedFilter === 'Dairy' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Dairy')}>🥛 Dairy</Button>
                <Button colorScheme={selectedFilter === 'Fruit' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Fruit')}>🍎 Fruit</Button>
                <Button colorScheme={selectedFilter === 'Grain' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Grain')}>🌾 Grain</Button>
                <Button colorScheme={selectedFilter === 'Seafood' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Seafood')}>🐟 Seafood</Button>
                <Button colorScheme={selectedFilter === 'Condiment' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Condiment')}>🧂 Condiment</Button>
                <Button colorScheme={selectedFilter === 'Dried Good' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Dried Good')}>🍪 Dried Good</Button>
                <Button colorScheme={selectedFilter === 'Canned Food' ? 'green' : 'gray'} variant="solid" onClick={() => handleFilterChange('Canned Food')}>🥫 Canned Food</Button>
            </Stack>
        </div>
        <div className="inventory-grid">
            {inventoryItems.map(item => (
                <InventoryItem
                    key={item.item + item.purchase_date}
                    id={item.item}
                    item={item.item}
                    category={item.category}
                    quantity={item.quantity}
                    purchase_date={item.purchase_date}
                    expiry_date={item.expiry_date}
                    onDecrement={onDecrement}
                    onDelete={() => onDelete(item.item, item.purchase_date, item.expiry_date)}
                    fetchInventoryItems={fetchInventoryItems} // Pass fetchInventoryItems prop
                    user_id={item.user_id} // Pass user_id prop 
                />
            ))}
        </div>
    </>
);

const SortButton = ({ handleSortChange, sortCriterion }) => (
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="white">
            Sort By: {sortCriterion.charAt(0).toUpperCase() + sortCriterion.slice(1).replace('_', ' ')}
        </MenuButton>
        <MenuList>
            <MenuItem onClick={() => handleSortChange('expiry_date')}>Expiry Date (Earliest to latest)</MenuItem>
            <MenuItem onClick={() => handleSortChange('alphabetical')}>Alphabetical (A to Z)</MenuItem>
            <MenuItem onClick={() => handleSortChange('Quantity (Lowest to Highest)')}>Quantity (Lowest to Highest)</MenuItem>
            <MenuItem onClick={() => handleSortChange('Quantity (Highest to Lowest)')}>Quantity (Highest to Lowest)</MenuItem>
            <MenuItem onClick={() => handleSortChange('purchase_date')}>Purchase Date (Earliest to latest)</MenuItem>
        </MenuList>
    </Menu>
);

const AddItem = () => (
    <div>
        <h2>Add a new item</h2>
    </div>
);

function App() {
    const userId = 6; // Replace with the actual user ID
    const [filter, setFilter] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortCriterion, setSortCriterion] = useState('expiry_date'); // Change default sort criterion here
    

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch(`${apiUrl}/grocery/${userId}`);
            const data = await response.json();
            if (response.ok) {
                console.log("Fetched inventory items:", data); // Debugging statement
                setInventoryItems(data);
            } else {
                throw new Error('Failed to fetch items');
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    useEffect(() => {
        fetchInventoryItems();
    }, [userId]);

    const handleFilterChange = (category) => {
        setFilter(category);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        console.log("Search initiated with query:", value);
    };

    const handleSortChange = (criterion) => {
        setSortCriterion(criterion);
    };

    const sortedItems = [...inventoryItems].sort((a, b) => {
        if (sortCriterion === 'expiry_date') {
            return new Date(a.expiry_date) - new Date(b.expiry_date);
        } else if (sortCriterion === 'Quantity (Lowest to Highest)') {
            return parseInt(a.quantity) - parseInt(b.quantity);
        } else if (sortCriterion === 'Quantity (Highest to Lowest)') {
            return parseInt(b.quantity) - parseInt(a.quantity);
        } else if (sortCriterion === 'purchase_date') {
            return new Date(a.purchase_date) - new Date(b.purchase_date);
        } else if (sortCriterion === 'alphabetical') {
            return a.item.localeCompare(b.item);
        }
        return 0;
    });

    const filteredSortedItems = sortedItems.filter(item => {
        return (filter === 'All' || item.category === filter) &&
            (searchQuery === '' || item.item.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const updateServer = async (updatedItem) => {
        try {
            console.log('Updating server with item:', updatedItem); // Debugging statement
            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update items on the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after update:', data); // Debugging statement
        } catch (error) {
            console.error('Error updating server:', error);
        }
    };

    const deleteItemFromServer = async (itemToDelete) => {
        try {
            console.log('Deleting item from server:', itemToDelete); // Debugging statement
            const response = await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId.toString(),
                    item: itemToDelete.item,
                    purchase_date: itemToDelete.purchase_date,
                    expiry_date: itemToDelete.expiry_date
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete item from the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after delete:', data); // Debugging statement
        } catch (error) {
            console.error('Error deleting item from server:', error);
        }
    };

    const onDecrement = (id, amount) => {
        const updatedItems = inventoryItems.map(item =>
            item.item === id ? { ...item, quantity: Math.max(parseInt(item.quantity) - amount, 0).toString() } : item
        );

        const updatedItem = updatedItems.find(item => item.item === id);

        if (updatedItem.quantity === "0") {
            // If quantity is 0, delete the item
            deleteItemFromServer(updatedItem);
            const filteredItems = updatedItems.filter(item => item.item !== id);
            setInventoryItems(filteredItems);
        } else {
            // Otherwise, update the item on the server
            const payload = [
                {
                    user_id: userId.toString(),
                    item: updatedItem.item,
                    quantity: updatedItem.quantity,
                    category: updatedItem.category,
                    purchase_date: updatedItem.purchase_date,
                    expiry_date: updatedItem.expiry_date
                }
            ];

            console.log('Payload to send:', payload); // Debugging statement

            setInventoryItems(updatedItems);
            updateServer(payload);
        }
    };

    const onDelete = async (id, purchase_date, expiry_date) => {
        try {
            const payload = {
                user_id: userId.toString(),
                item: id,
                purchase_date: purchase_date,
                expiry_date: expiry_date
            };

            console.log('Deleting item with payload:', payload); // Debugging statement

            const response = await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete item from the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after delete:', data); // Debugging statement

            const updatedItems = inventoryItems.filter(item => !(item.item === id && item.purchase_date === purchase_date && item.expiry_date === expiry_date));
            console.log('Updated items after delete:', updatedItems); // Debugging statement
            setInventoryItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <Router>
            <div className="main-background">
            <div className="main-container">
            <div class="main-content">
                <div className="content">
                <Routes>
                    <Route path="/" element={<Navigate to="/groceries" />} />
                    <Route path="/recipes" element={<RecipeList userId={userId} />} />
                    <Route path="/saved-recipes" element={<SavedRecipes userId={userId} />} />
                    <Route path="/groceries" element={
                        <Groceries
                            inventoryItems={filteredSortedItems}
                            onDecrement={onDecrement}
                            onDelete={onDelete}
                            handleFilterChange={handleFilterChange}
                            handleSearchChange={handleSearchChange}
                            fetchInventoryItems={fetchInventoryItems}
                            handleSortChange={handleSortChange}
                            sortCriterion={sortCriterion}
                            selectedFilter={filter}
                        />
                    } />
                    <Route path="/add" element={<AddItem user_id={userId} />} />
                    <Route path="/scanner" element={<CameraComponent userId={userId}/>} />
                    <Route path="/edit-item" element={<EditItemForm fetchInventoryItems={fetchInventoryItems} />} />
                    <Route path="/upload-receipt" element={<ImageUpload userId={userId} />} />
                    <Route path="/edit/:index" element={<EditReceiptItem />} />
                    <Route path="/items" element={<ItemsList userId={userId} fetchInventoryItems={fetchInventoryItems}/>} />
                    <Route path="/dashboard" element={<Dashboard userId={userId} />} />
                    <Route path="/community" element={<Leaderboard userId={userId} />}/>
                </Routes>
                </div>
                <BottomMenuBar fetchInventoryItems={fetchInventoryItems} user_id={userId} />
            </div>
            </div>
            </div>
        </Router>
    );
}

export default App;
