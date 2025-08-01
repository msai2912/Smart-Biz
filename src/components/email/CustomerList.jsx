import { useState, useEffect } from 'react';
import './CustomerList.css';

const CustomerList = ({ onCustomersSelected, selectedCustomers = [] }) => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', tags: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Load customers from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('customer_list');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Add some sample customers
      const sampleCustomers = [
        { id: 1, name: 'John Smith', email: 'john@example.com', tags: ['VIP', 'Regular'], dateAdded: new Date().toISOString() },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', tags: ['Newsletter'], dateAdded: new Date().toISOString() },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', tags: ['Promotion'], dateAdded: new Date().toISOString() }
      ];
      setCustomers(sampleCustomers);
      localStorage.setItem('customer_list', JSON.stringify(sampleCustomers));
    }
  }, []);

  // Save customers to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('customer_list', JSON.stringify(customers));
  }, [customers]);

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert('Please enter both name and email.');
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      email: newCustomer.email,
      tags: newCustomer.tags ? newCustomer.tags.split(',').map(tag => tag.trim()) : [],
      dateAdded: new Date().toISOString()
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: '', email: '', tags: '' });
    setIsAddingCustomer(false);
  };

  const handleRemoveCustomer = (customerId) => {
    if (confirm('Are you sure you want to remove this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  const handleCustomerSelect = (customer, isSelected) => {
    let updatedSelection;
    if (isSelected) {
      updatedSelection = [...selectedCustomers, customer];
    } else {
      updatedSelection = selectedCustomers.filter(c => c.id !== customer.id);
    }
    onCustomersSelected(updatedSelection);
  };

  const handleSelectAll = () => {
    const filteredCustomers = getFilteredCustomers();
    if (selectedCustomers.length === filteredCustomers.length) {
      onCustomersSelected([]);
    } else {
      onCustomersSelected(filteredCustomers);
    }
  };

  const getFilteredCustomers = () => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => customer.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  };

  const getAllTags = () => {
    const allTags = customers.flatMap(customer => customer.tags);
    return [...new Set(allTags)];
  };

  const filteredCustomers = getFilteredCustomers();
  const allTags = getAllTags();

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h3>Customer List ({filteredCustomers.length})</h3>
        <button 
          className="add-customer-btn"
          onClick={() => setIsAddingCustomer(true)}
        >
          + Add Customer
        </button>
      </div>

      {isAddingCustomer && (
        <div className="add-customer-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Customer Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
          </div>
          <input
            type="text"
            placeholder="Tags (comma separated, e.g., VIP, Newsletter)"
            value={newCustomer.tags}
            onChange={(e) => setNewCustomer({...newCustomer, tags: e.target.value})}
          />
          <div className="form-actions">
            <button onClick={handleAddCustomer} className="btn-primary">Add Customer</button>
            <button onClick={() => setIsAddingCustomer(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="customer-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {allTags.length > 0 && (
          <div className="tag-filters">
            <span>Filter by tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="customer-actions">
        <button 
          className="select-all-btn"
          onClick={handleSelectAll}
        >
          {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 
            ? 'Deselect All' 
            : 'Select All'}
        </button>
        <span className="selection-count">
          {selectedCustomers.length} selected
        </span>
      </div>

      <div className="customer-table">
        <div className="table-header">
          <div className="col-select"></div>
          <div className="col-name">Name</div>
          <div className="col-email">Email</div>
          <div className="col-tags">Tags</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="table-row">
            <div className="col-select">
              <input
                type="checkbox"
                checked={selectedCustomers.some(c => c.id === customer.id)}
                onChange={(e) => handleCustomerSelect(customer, e.target.checked)}
              />
            </div>
            <div className="col-name">{customer.name}</div>
            <div className="col-email">{customer.email}</div>
            <div className="col-tags">
              {customer.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="col-actions">
              <button 
                className="remove-btn"
                onClick={() => handleRemoveCustomer(customer.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        {filteredCustomers.length === 0 && (
          <div className="no-customers">
            {customers.length === 0 
              ? 'No customers added yet. Click "Add Customer" to get started.'
              : 'No customers match your search criteria.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
