import { Card, Carousel, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';

import ImageViewer from "react-simple-image-viewer";
import { RealEstateProperty } from '../interfaces/property';
import { getProperties } from '../services/propertiesService';
import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   return (
//     <div className="header">
//       <img src="/home-06.jpg" alt="Logo" className="logo" style={{ maxWidth: '15%', maxHeight: '15%', width: 'auto', height: 'auto' }} />
//       <h1 className="title">Real Estate Viewer</h1>
//     </div>
//   );
// };


const ViewProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([] as RealEstateProperty[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchLocality, setSearchLocality] = useState('');

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imagesSrc, setImagesSrc] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<number>(0);
  
  const propertiesPerPage = 10; // Update properties per page to 10

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLocality(event.target.value);
    setCurrentPage(1); // Reset current page when search query changes
  };

  const openImageViewer = useCallback((index: React.SetStateAction<number>) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const showProperty = (propertyID: number) => {
    console.log(`Show property with ID ${propertyID}`);
    navigate(`/showProperty/${propertyID}`);
  };

  // Get the properties from the express server
  useEffect(() => {
    getProperties(currentPage).then((response) => {
      setProperties(response.data);
      setTotalPages(Math.ceil(response.meta.count / propertiesPerPage));
    })
  }, [currentPage]);

  return (
    <Container>
      { isViewerOpen && 
          <ImageViewer
            src={imagesSrc}
            currentIndex={currentImage}
            onClose={closeImageViewer}
            disableScroll={true}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.9)"
            }}
            closeOnClickOutside={true}
          />
      }
      {/* <Row>
        <Col md={12}>
          <div className="header">
            <img src="/home-06.jpg" alt="Logo" className="logo" style={{ maxWidth: '15%', maxHeight: '15%', width: 'auto', height: 'auto' }} />
          </div>
        </Col>
      </Row> */}
      <Row>
        <Col md={3}></Col>
        <Col md={9}>
          <Form className="mt-4 mb-4">
            <Form.Group controlId="searchLocality">
              <Form.Control
                type="text"
                placeholder="Search by State"
                value={searchLocality}
                onChange={handleSearchChange}
                style={{ width: '100%' }} 
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="filters" style={{ backgroundColor: 'lightgrey', padding: '1rem', borderRadius: '5px' }}>
            {/* Add your filters here */}
            <h3 style={{textAlign: 'left'}}>Filters</h3>
            <Form.Group controlId="propertyAge">
              <Form.Label className="d-flex align-items-center justify-content-between">
                <span>Age</span>
                <Form.Control as="select" className="form-select" style={{ width: '70%' }}>
                  <option>All</option>
                  <option>New</option>
                  <option>1-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </Form.Control>
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="bhks">
              <Form.Label className="d-flex align-items-center justify-content-between">
                <span>BHKs</span>
                <Form.Control as="select" className="form-select" style={{ width: '70%' }}>
                  <option>All</option>
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                  <option>4+ BHK</option>
                </Form.Control>
              </Form.Label>
            </Form.Group>
            <Form.Group controlId="sortFilters">
              <Form.Label className="d-flex align-items-center justify-content-between">
                <span>Sort</span>
                <Form.Control as="select" className="form-select" style={{ width: '70%' }}>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Area: Low to High</option>
                  <option>Area: High to Low</option>
                </Form.Control>
              </Form.Label>
            </Form.Group>
          </div>
        </Col>
        <Col md={9}>
          <div className="property-list">
            <Row>
              {properties.map((property) => (
                <Col key={property.id} md={6} className="mb-4">
                  <Card>
                    <Row>
                      <Col md={5}>
                          <div style={{ height: '100%' }}>
                            <Carousel variant='dark' style={{ zIndex:0, height: '100%' }}>
                              {property.images.map((image, index) => (
                                <Carousel.Item key={index} style={{ height: '100%', objectFit: 'cover', marginTop:'25%' }}>
                                  <img
                                    src={image}
                                    alt={`Property ${index}`}
                                    className="d-block w-100"
                                    style={{ maxHeight: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => {
                                      openImageViewer(index);
                                      setImagesSrc(property.images);
                                      console.log("Set images src: ", property.images);
                                      setCurrentImage(index);
                                    }}
                                  />
                                </Carousel.Item>
                              ))}
                            </Carousel>
                          </div>
                      </Col>
                      <Col md={7}>
                        <Card.Body>
                          <Card.Title
                            style={{ fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
                            onClick={() => showProperty(property.id)}
                          >
                            {property.name}
                          </Card.Title>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ textAlign: 'left', width: '50%'}}>
                              <span style={{ fontWeight: 'bold' }}>Price</span> <br/> {property.price}
                            </div>
                            <div style={{ textAlign: 'left', width: '50%'}}>
                              <span style={{ fontWeight: 'bold' }}>Property Type</span> <br/>  {property.propertyType}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '0.5rem' }}>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                              <span style={{ fontWeight: 'bold' }}>Locality</span> <br/>  {property.locality}
                            </div>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                              <span style={{ fontWeight: 'bold' }}>State</span> <br/>  {property.state}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                              <span style={{ fontWeight: 'bold' }}>Area</span> <br/>  {property.area}
                            </div>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                              <span style={{ fontWeight: 'bold' }}>Bedrooms</span> <br/>  {property.bedrooms}
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination className="justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProperties;
