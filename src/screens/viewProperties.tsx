import { Badge, Button, Card, Carousel, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import { FaBath, FaBed, FaRulerCombined, FaTrash } from "react-icons/fa";
import { PropertyTypeConfig, StateConfig } from '../interfaces/config';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { capitalizeAllWords, capitalizeFirstLetter, formatNumberWithCommas } from '../utils/stringTransformers';

import ClipLoader from "react-spinners/ClipLoader";
import ImageViewer from "react-simple-image-viewer";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { RealEstateProperty } from '../interfaces/realEstateProperty';
import { getConfigByID } from '../services/configsService';
import { getProperties } from '../services/propertiesService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const override: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  borderColor: "black",
  zIndex: 9999999,
  position: "fixed",
  textAlign: 'center',
  float: 'right',
};

const ViewProperties = () => {
  const navigate = useNavigate();

  // Config related
  const [states, setStates] = useState([] as StateConfig[]);
  const [propertyTypes, setPropertyTypes] = useState([] as PropertyTypeConfig[]);

  const [properties, setProperties] = useState([] as RealEstateProperty[]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showingCount, setShowingCount] = useState(0);

  // ImageViewer related
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imagesSrc, setImagesSrc] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<number>(0);

  // To show loading spinner
  let [loading, setLoading] = useState(false);

  // States autocomplete related
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleOnStateSelect = (item: any) => {
    console.log("Selected states: ", selectedStates);
    console.log(item);
    if (selectedStates.length < 5) {
      setSelectedStates([...selectedStates, item.id]);
    }
    setCurrentPage(1); // Reset current page when search query changes
  };

  const handleRemoveState = (index: number) => {
    const newSelectedStates = [...selectedStates];
    newSelectedStates.splice(index, 1);
    setSelectedStates(newSelectedStates);
    setCurrentPage(1); // Reset current page when search query changes
  }
  
  // Property type related
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("" as string);
  
  const handleOnPropertyTypeSelect = (event: any) => {
    setSelectedPropertyType(event.target.value);
    setCurrentPage(1); // Reset current page when search query changes
  }
  
  const propertiesPerPage = 8; // Update properties per page to 8

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Image Viewer related
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
    setLoading(true);
    getProperties(selectedStates, selectedPropertyType, currentPage, propertiesPerPage).then((response) => {
      setProperties(response.data);
      setTotalPages(Math.ceil(response.meta.count / propertiesPerPage));
      setTotalCount(response.meta.count);
      setShowingCount(Math.min(propertiesPerPage, response.data.length));
      setLoading(false);
    }, (err) => {
      console.log(err);
      setLoading(false);
      toast.error(err.message);
    })
  }, [currentPage, selectedStates, selectedPropertyType]);

  // Get the config from the express server
  useEffect(() => {
    setLoading(true);
    getConfigByID('real-estate-viewer').then((response) => {
      const states = response.data?.data?.states?.map((state: any) => ({ id: state.id, name: capitalizeAllWords(state.name) })) || [];
      setStates(states);
      console.log(response.data?.data?.propertyTypes);
      setPropertyTypes(response.data?.data?.propertyTypes || []);
      setLoading(false);
    }, (err) => {
      console.log(err);
      setLoading(false);
      toast.error(err.message);
    })
  }, []);

  return (
    <div>
      {
        loading &&
         <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 99999999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'grey', // Change the background color to grey
        }}>
          <ClipLoader
            color="#ffffff"
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      }

      {
        !loading && states && propertyTypes &&
          <Container fluid={true}>
            { isViewerOpen && 
                <ImageViewer
                  src={imagesSrc}
                  currentIndex={currentImage}
                  onClose={closeImageViewer}
                  disableScroll={true}
                  backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    zIndex: 99999999999
                  }}
                  closeOnClickOutside={true}
                />
            }
            <Row style={{ display: 'inline-flex', backgroundColor: 'lightBlue', width: '102%' }}>
              <Col md={1}/>
              <Col md={6}>
                <div 
                  className="mt-4 mb-2" 
                  style={{ 
                    pointerEvents: selectedStates.length >= 5 ? 'none' : 'auto', 
                    opacity: selectedStates.length >= 5 ? 0.5 : 1,
                    zIndex: 9999999
                  }}
                >
                  <ReactSearchAutocomplete
                    placeholder="Search by State"
                    items={states}
                    onSelect={handleOnStateSelect}
                    autoFocus
                    styling={{
                      borderRadius: '25px',
                      boxShadow: 'none',
                      height: '40px',
                      zIndex: 9999999
                    }}
                  />
                </div>
                {
                  selectedStates.length > 0 &&
                    <Row className="mb-2">
                      <Col md={12} style={{ textAlign: 'left' }}>

                        <Col md={12} style={{ textAlign: 'left' }}>
                          {selectedStates.map((state, index) => (
                            <Badge
                              key={index}
                              pill
                              // variant="primary"
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            >
                              {state}
                              <span
                                className="ml-1"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRemoveState(index)}
                              >
                                {/* &#10005; */}
                                &nbsp;<FaTrash />
                              </span>
                            </Badge>
                          ))}
                        </Col>
                      </Col>
                    </Row>
                }
              </Col>
              {/*
              // TODO: Add this filter back in
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
              </Col> */}
              <Col md={4}>
                <Form.Group controlId="propertyType" className="mt-4 mb-4">
                  <Form.Control
                    as="select"
                    className="form-select"
                    size="sm"
                    onChange={handleOnPropertyTypeSelect}
                    value={selectedPropertyType}
                  >
                    <option value="">All Property Types</option>
                    {
                    propertyTypes.map((propertyType) => (
                      <option key={propertyType.id} value={propertyType.id}>{capitalizeAllWords(propertyType.name)}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={1}/>
              {/* 
              TODO: Add these two filters back in
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
              </Col> */}
            </Row>

            <br/><br/>
            
            { properties.length > 0 &&
              <div>
                <Row>
                  <Col md={12}>
                    <i><h3 style={{ textAlign: 'left' }}>Showing {(currentPage-1) * propertiesPerPage + 1} - {(currentPage-1) * propertiesPerPage + showingCount} of {totalCount} Properties...</h3></i>
                  </Col>
                </Row>
              
                <br/>

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
              </div>
            }

            {properties.length === 0 && !loading && (
              <Container fluid={true}>
                <Row>
                  <Col md={12}>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <h3 style={{ color: '#118c3e', fontWeight: 'bold', fontSize: '1.5rem' }}>No Properties Found</h3>
                      <p style={{ color: '#777', fontSize: '1rem' }}>We couldn't find any properties matching your search criteria.</p>
                    </div>
                  </Col>
                </Row>
              </Container>
            )}
          </Container>
      }

    </div>
  );
};

export default ViewProperties;
