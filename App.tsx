import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { PropertyList } from './components/PropertyList';
import { LoginDialog } from './components/LoginDialog';
import { OwnerDashboard } from './components/OwnerDashboard';
import { MessagingCenter } from './components/MessagingCenter';
import { ContactOwnerDialog } from './components/ContactOwnerDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { supabase, api } from './utils/supabase/client';

interface BoardingHouse {
  id: string;
  name: string;
  address: string;
  price: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
  coordinates: [number, number];
  owner: string;
  ownerId: string;
  contact: string;
  images: string[];
  description: string;
  rating?: number;
  distance?: string;
  createdAt?: string;
  updatedAt?: string;
}

const mockBoardingHouses: BoardingHouse[] = [
  {
    id: '1',
    name: 'Sunshine Boarding House',
    address: 'Brgy. Zone 25, Baybay City, Leyte',
    price: 3500,
    availableRooms: 3,
    totalRooms: 10,
    amenities: ['WiFi', 'AC', 'Kitchen', 'Laundry', 'Security'],
    coordinates: [10.7202, 124.8044],
    owner: 'Maria Santos',
    ownerId: 'mock-owner-1',
    contact: '09123456789',
    images: ['https://images.unsplash.com/photo-1594130139005-3f0c0f0e7c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZGluZyUyMGhvdXNlJTIwcm9vbSUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU3MzkzNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'A cozy boarding house near VSU with all essential amenities. Walking distance to campus and local eateries.',
    rating: 4.5,
    distance: '0.5 km from VSU'
  },
  {
    id: '2',
    name: 'Blue Haven Dormitory',
    address: 'Brgy. Punta, Baybay City, Leyte',
    price: 2800,
    availableRooms: 0,
    totalRooms: 8,
    amenities: ['WiFi', 'Kitchen', 'Study Area', 'Water Station'],
    coordinates: [10.7190, 124.8030],
    owner: 'John Dela Cruz',
    ownerId: 'mock-owner-2',
    contact: '09187654321',
    images: ['https://images.unsplash.com/photo-1520277739336-7bf67edfa768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NTczOTM3MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'Affordable dormitory with study-friendly environment. Quiet neighborhood perfect for focused students.',
    rating: 4.2,
    distance: '0.8 km from VSU'
  },
  {
    id: '3',
    name: 'Green Valley Apartments',
    address: 'Brgy. Kabatuan, Baybay City, Leyte',
    price: 4200,
    availableRooms: 5,
    totalRooms: 12,
    amenities: ['WiFi', 'AC', 'Parking', 'Kitchen', 'Laundry', 'Security', 'CCTV'],
    coordinates: [10.7180, 124.8070],
    owner: 'Anna Rodriguez',
    ownerId: 'mock-owner-3',
    contact: '09165432198',
    images: ['https://images.unsplash.com/photo-1545165375-583920dc2f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBhcGFydG1lbnQlMjByb29tfGVufDF8fHx8MTc1NzM5MzcxNnww&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'Modern apartments with premium amenities. Spacious rooms with excellent ventilation and parking space.',
    rating: 4.7,
    distance: '1.2 km from VSU'
  },
  {
    id: '4',
    name: 'Peaceful Lodge',
    address: 'Brgy. Zone 23, Baybay City, Leyte',
    price: 3000,
    availableRooms: 2,
    totalRooms: 6,
    amenities: ['WiFi', 'Kitchen', 'Common Room', 'Water Station'],
    coordinates: [10.7220, 124.8050],
    owner: 'Roberto Garcia',
    ownerId: 'mock-owner-4',
    contact: '09198765432',
    images: ['https://images.unsplash.com/photo-1623334663819-1bb79f9f03f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZGluZyUyMGhvdXNlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzU3MzkzNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'Small, intimate boarding house with a homey atmosphere. Perfect for students who prefer a quiet environment.',
    rating: 4.3,
    distance: '0.3 km from VSU'
  },
  {
    id: '5',
    name: 'Student Haven',
    address: 'Brgy. Zone 22, Baybay City, Leyte',
    price: 3800,
    availableRooms: 4,
    totalRooms: 15,
    amenities: ['WiFi', 'AC', 'Kitchen', 'Laundry', 'Study Area', 'Security', 'Refrigerator'],
    coordinates: [10.7210, 124.8040],
    owner: 'Carmen Mendoza',
    ownerId: 'mock-owner-5',
    contact: '09156789012',
    images: ['https://images.unsplash.com/photo-1718755923874-49a5e15ad928?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzM5MzcyMnww&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'Popular among VSU students with comprehensive amenities and study areas. Well-maintained facilities.',
    rating: 4.6,
    distance: '0.6 km from VSU'
  },
  {
    id: '6',
    name: 'University Residences',
    address: 'Brgy. Punta, Baybay City, Leyte',
    price: 4500,
    availableRooms: 1,
    totalRooms: 20,
    amenities: ['WiFi', 'AC', 'Kitchen', 'Laundry', 'Parking', 'Security', 'CCTV', 'Generator', 'Study Area'],
    coordinates: [10.7195, 124.8035],
    owner: 'Michael Torres',
    ownerId: 'mock-owner-6',
    contact: '09173456789',
    images: ['https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaG91c2luZyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1NzM5MzcyNXww&ixlib=rb-4.1.0&q=80&w=1080'],
    description: 'Premium student housing with state-of-the-art facilities. Multiple study areas and 24/7 security.',
    rating: 4.8,
    distance: '0.9 km from VSU'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<BoardingHouse | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'owner' | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [properties, setProperties] = useState<BoardingHouse[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contactProperty, setContactProperty] = useState<BoardingHouse | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.amenities.some(amenity => 
                             amenity.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      
      const matchesAmenities = selectedAmenities.length === 0 || 
                              selectedAmenities.every(amenity => 
                                property.amenities.includes(amenity)
                              );
      
      return matchesSearch && matchesPrice && matchesAmenities;
    });
  }, [properties, searchQuery, priceRange, selectedAmenities]);

  // Load properties and check authentication on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const profile = await api.get('/profile');
            setIsLoggedIn(true);
            setUserType(profile.userType);
            setUserData(profile);
          } catch (error) {
            console.log('Failed to load user profile:', error);
          }
        }

        // Load properties
        await loadProperties();
        
        // Initialize sample data if needed
        try {
          await api.post('/init-sample-data');
        } catch (error) {
          console.log('Sample data already exists or failed to initialize');
        }
      } catch (error) {
        console.log('Initialization error:', error);
        toast.error('Failed to initialize app');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadProperties = async () => {
    try {
      const fetchedProperties = await api.get('/properties');
      setProperties(fetchedProperties);
    } catch (error) {
      console.log('Failed to load properties:', error);
      toast.error('Failed to load properties');
      // Fallback to mock data
      setProperties(mockBoardingHouses);
    }
  };

  const loadOwnerProperties = async () => {
    if (!isLoggedIn || userType !== 'owner') return [];
    try {
      return await api.get('/owner/properties');
    } catch (error) {
      console.log('Failed to load owner properties:', error);
      return [];
    }
  };

  const ownerProperties = useMemo(() => {
    if (!isLoggedIn || userType !== 'owner') return [];
    return properties.filter(p => p.ownerId === userData?.id);
  }, [properties, isLoggedIn, userType, userData]);

  const handleLogin = (type: 'student' | 'owner', profileData: any) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserData(profileData);
    loadProperties(); // Refresh properties after login
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserType(null);
      setUserData(null);
      setCurrentView('map');
      toast.success('Logged out successfully');
    } catch (error) {
      console.log('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleUpdateProperty = async (updatedProperty: BoardingHouse) => {
    try {
      await api.put(`/properties/${updatedProperty.id}`, updatedProperty);
      setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
      toast.success('Property updated successfully');
    } catch (error) {
      console.log('Property update error:', error);
      toast.error('Failed to update property');
    }
  };

  const handleAddProperty = async (newProperty: BoardingHouse) => {
    try {
      const { property } = await api.post('/properties', newProperty);
      setProperties(prev => [...prev, property]);
      toast.success('Property added successfully');
    } catch (error) {
      console.log('Property add error:', error);
      toast.error('Failed to add property');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.log('Property delete error:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleStartConversation = (property: BoardingHouse) => {
    if (!isLoggedIn) {
      toast.error('Please log in to contact property owners');
      setShowLoginDialog(true);
      return;
    }
    
    if (userType !== 'student') {
      toast.error('Only students can contact property owners');
      return;
    }

    setContactProperty(property);
    setShowContactDialog(true);
  };

  const handleMessageSent = () => {
    toast.success('Message sent! You can view replies in the Messages section.');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'map':
        return (
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            searchQuery={searchQuery}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedAmenities={selectedAmenities}
            onAmenitiesChange={setSelectedAmenities}
            currentUser={userData}
            onStartConversation={handleStartConversation}
          />
        );
      case 'list':
        return (
          <PropertyList
            properties={filteredProperties}
            onPropertySelect={(property) => {
              setSelectedProperty(property);
              setCurrentView('map');
            }}
            searchQuery={searchQuery}
            currentUser={userData}
            onStartConversation={handleStartConversation}
          />
        );
      case 'properties':
        if (userType === 'owner') {
          return (
            <OwnerDashboard
              ownerProperties={ownerProperties}
              onUpdateProperty={handleUpdateProperty}
              onAddProperty={handleAddProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          );
        }
        return <div>Access denied. Owner account required.</div>;
      case 'messages':
        if (!isLoggedIn) {
          return (
            <div className="p-6 text-center">
              <h1>Messages</h1>
              <p className="text-muted-foreground mb-4">
                Please log in to access your messages.
              </p>
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="text-primary hover:underline"
              >
                Log in here
              </button>
            </div>
          );
        }
        return (
          <div className="p-6">
            <h1 className="mb-6">Messages</h1>
            <MessagingCenter 
              currentUser={userData} 
              properties={properties}
            />
          </div>
        );
      default:
        return (
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            searchQuery={searchQuery}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedAmenities={selectedAmenities}
            onAmenitiesChange={setSelectedAmenities}
            currentUser={userData}
            onStartConversation={handleStartConversation}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading VSU BoardMap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onViewChange={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogin={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        userType={userType}
      />
      
      <main className="container mx-auto py-6">
        {renderContent()}
      </main>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      <ContactOwnerDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        property={contactProperty}
        currentUser={userData}
        onMessageSent={handleMessageSent}
      />

      <Toaster />
    </div>
  );
}
