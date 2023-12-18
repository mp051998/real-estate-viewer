import { Button, Card, Carousel, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { FaBath, FaBed, FaRulerCombined } from "react-icons/fa";
import React, { useCallback, useEffect, useState } from 'react';
import { capitalizeFirstLetter, formatNumberWithCommas } from '../utils/stringTransformers';

import ImageViewer from "react-simple-image-viewer";
import { RealEstateProperty } from '../interfaces/realEstateProperty';
import { getProperties } from '../services/propertiesService';
import { useNavigate } from 'react-router-dom';

const ViewProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([] as RealEstateProperty[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchLocality, setSearchLocality] = useState('');

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imagesSrc, setImagesSrc] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<number>(0);
  
  const propertiesPerPage = 8; // Update properties per page to 8

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
    getProperties(currentPage, propertiesPerPage).then((response) => {
      setProperties(response.data);
      setTotalPages(Math.ceil(response.meta.count / propertiesPerPage));
    })
  }, [currentPage]);
  
  return (
    <Container fluid={true}>
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
      <Row style={{ display: 'inline-flex', backgroundColor: 'lightBlue', width: '100%' }}>
        <Col md={4}>
          <Form className="mt-4 mb-4">
            <Form.Group controlId="searchLocality">
              <Form.Control
                type="text"
                placeholder="State"
                value={searchLocality}
                onChange={handleSearchChange}
                style={{ width: '100%' }}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col md={2}>
          <Form.Group controlId="propertyAge" className="mt-4 mb-4">
            <Form.Control
              as="select"
              className="form-select"
              size="sm"
            >
              <option hidden={true}>Property Age</option>
              <option value="new">New</option>
              <option value="1-5">1-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="propertyType" className="mt-4 mb-4">
            <Form.Control
              as="select"
              className="form-select"
              size="sm"
            >
              <option hidden={true}>Property Type</option>
              <option value="single-family">Single Family</option>
              <option value="multi-family">Multi Family</option>
              <option value="mobile">Mobile Home</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="farm">Farm</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId='bedrooms' className="mt-4 mb-4">
            <Form.Control
              as="select"
              className="form-select"
              size="sm"
            >
              <option hidden={true}>Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId='bathrooms' className="mt-4 mb-4">
            <Form.Control
              as="select"
              className="form-select"
              size="sm"
            >
              <option hidden={true}>Bathrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <br/><br/>

      <Row>
        <Col md={12}>
          <Row>
            {properties.map((property) => (
              <Col key={property.id} md={3}>
                <Card style={{marginBottom: '0.5rem', border: '1px solid black'}}>
                  <Row>
                    <Col md={12}>
                      <Carousel variant='dark' indicators={false} style={{ zIndex:0, width: '100%', aspectRatio: '16/9'}}>
                        {property.images?.map((image, index) => (
                          <Carousel.Item key={index} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <img
                              src={image}
                              alt={`Property ${index}`}
                              className="d-block w-100"
                              style={{
                                display: 'flex',
                                width: '100%',
                                height: 'auto',
                                cursor: 'pointer',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                aspectRatio: '16/9'
                              }}
                              onClick={() => {
                                openImageViewer(index);
                                setImagesSrc(property?.images || []);
                                console.log("Set images src: ", property.images);
                                setCurrentImage(index);
                              }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </Col>
                  </Row>
                  
                  <Row style={{ backgroundColor: 'lightGrey', marginLeft: 0, marginRight: 0, borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                    <Col md={4}>
                      <FaBed /> {property.bedrooms} <br/> Bedrooms
                    </Col>
                    <Col md={4}>
                      < FaRulerCombined /> {property.area} <br/> {property.areaUnit}
                    </Col>
                    <Col md={4}>
                      < FaBath /> {property.bathrooms} <br/> Bathrooms 
                    </Col>
                  </Row>

                  <Row style={{ marginLeft: '0.01rem', marginTop: '0.5rem', textAlign: 'left'}}>
                    <h3 style={{ color: '#118c3e' }}>{`${property.currencySymbol}${formatNumberWithCommas(property?.price.toString())}`}</h3>
                  </Row>

                  <Row style={{ marginLeft: '0.01rem', textAlign: 'left'}}>
                    <span style={{cursor: 'pointer'}} onClick={() => showProperty(property.id)}>
                      <b><u><h5>{property.address}</h5></u></b>
                    </span>
                  </Row>
                  
                  <Row style={{ marginLeft: '0.5rem', marginTop: '1rem', marginBottom: '0.5rem'}}>
                    <Button variant='secondary' disabled={true} size='sm' style={{width:'fit-content'}}>
                      <b>{capitalizeFirstLetter(property.propertyType)}</b>
                    </Button>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <br/>
          
          { properties && 
            <Pagination className="justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  style={{zIndex: 0}}
                  hidden={totalPages <= 1}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProperties;
