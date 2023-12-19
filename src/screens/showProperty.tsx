import { Button, Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { CSSProperties, useEffect, useState } from 'react';
import { FaArrowLeft, FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { capitalizeAllWords, capitalizeFirstLetter, formatNumberWithCommas } from '../utils/stringTransformers';

import { ClipLoader } from 'react-spinners';
import DateTimePicker from 'react-datetime-picker'
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { RealEstateProperty } from '../interfaces/realEstateProperty';
import { getPropertyByID } from '../services/propertiesService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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

const ShowProperty = () => {
  const { propertyID } = useParams();
  const [propertyData, setPropertyData] = useState<RealEstateProperty>({} as RealEstateProperty);
  
  // DateTimePicker related
  const oneDayAhead = new Date();
  oneDayAhead.setDate(oneDayAhead.getDate() + 1);
  const [visitDate, setVisitDate] = useState<Value>(oneDayAhead);

  const twoWeeksAhead = new Date();
  twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

  // Image picker related
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  // Request Tour related
  const [ tourRequested, setTourRequested ] = useState<boolean>(false);
  const requestTourCallback = () => {
    // TODO: Add the functionality
    console.log(`Request tour for property with ID ${propertyID}`);
    console.log(`Visit date: ${visitDate}`);
    setTourRequested(true);
    
    // For now just show a toast
    toast.info(`Request received successfully. Our agent will contact you shortly!`);
  };

  // Spinner related
  const [ loading, setLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (!propertyID) {
      toast.error('Property ID Missing!');
      return;
    }

    setLoading(true);
    getPropertyByID(parseInt(propertyID || '')).then((response) => {
      setPropertyData(response.data);
      setLoading(false);
    }, (err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, [propertyID]);

  return (
    <div style={{backgroundColor: '#eeeeee', height: '100%' }}>
      {
        loading && <div style={{
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
        !loading && propertyData && 
          <Container fluid={true}>
            <Row style={{padding:'0.5rem', marginBottom:'0.5rem', position: 'sticky', top: 0, zIndex:1, backgroundColor: '#eeeeee', }}>
              <Col md={1} style={{textAlign:'left', 'padding': '1rem'}}>
                <Button variant='secondary' size='sm' style={{width:'fit-content'}} onClick={() => window.history.back()} >
                  < FaArrowLeft size={30} />
                </Button>
              </Col>
              <Col md={1}/>
              <Col md={8} style={{textAlign:'left'}}>
                <div>
                  <h4 style={{marginBottom:'0.5rem'}}>{propertyData.address}</h4>          
                  <Button variant='secondary' disabled={true} size='sm' style={{width:'fit-content'}}>
                    <b>{capitalizeFirstLetter(propertyData.propertyType)}</b>
                  </Button>
                </div>
              </Col>
              <Col md={2}/>
            </Row>
          
            <Row>
              <Col md={12}>
                <Carousel variant='primary' style={{ zIndex:0, height:'60vh', backgroundColor:'black' }}>
                  {propertyData.images?.map((image, index) => (
                      <Carousel.Item key={index} >
                        <img
                          src={image}
                          alt={`Property ${index}`}
                          style={{ maxHeight: '60vh', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => {
                            console.log("Set images src: ", propertyData.images);
                            setCurrentImage(index);
                            setIsViewerOpen(true);
                          }}
                        />
                      </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
            </Row>
        
            <Row style={{textAlign:'left', marginTop:'0.5rem'}}>
              <Col md={2}/>
              <Col md={5}>
                <Row>
                  <Col md={12}>
                    {
                      propertyData?.price && 
                        <u><b><h2>{`${propertyData.currencySymbol}${formatNumberWithCommas(propertyData.price.toString())}`}</h2></b></u>
                    }
                  </Col>
                </Row>
                
                <Row>
                  <Col md={12}>
                    <Card style={{ textAlign: 'left' }}>
                      <Card.Body>
                        <Container>
                          <Row style={{textAlign:'left'}}>
                            <Col md={4}>
                              <FaBed size={20} /> <span style={{ fontSize: '15px' }}><u><b>{propertyData.bedrooms}</b></u> Bedrooms</span>
                            </Col>
                            <Col md={4}>
                              <FaRulerCombined size={20} /> <span style={{ fontSize: '15px' }}><u><b>{propertyData.area}</b></u> {propertyData.areaUnit}</span>
                            </Col>
                            <Col md={4}>
                              <FaBath size={20} /> <span style={{ fontSize: '15px' }}><u><b>{propertyData.bathrooms}</b></u> Bathrooms</span>
                            </Col>
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row style={{marginTop:'0.5rem'}}>
                  <Col md={12}>
                    <Card>
                      <Card.Header>
                        <h6>KEY DETAILS</h6>
                      </Card.Header>
                      <Card.Body>
                        <Col md={12}>
                          <Row>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>PROPERTY ID</span><br/>
                              <span style={{ fontSize: '15px' }}><b>{propertyData.id}</b></span>
                            </Col>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>PROPERTY TYPE</span><br/>
                              <span style={{ fontSize: '15px' }}>{capitalizeFirstLetter(propertyData?.propertyType)}</span>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>BEDROOMS</span><br/>
                              <span style={{ fontSize: '15px' }}>{propertyData.bedrooms}</span>
                            </Col>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>BATHROOMS</span><br/>
                              <span style={{ fontSize: '15px' }}>{propertyData.bathrooms}</span>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>CARPET AREA</span><br/>
                              <span style={{ fontSize: '15px' }}>{`${propertyData.area} ${propertyData.areaUnit}`}</span>
                            </Col>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>SUPER BUILT-UP AREA</span><br/>
                              <span style={{ fontSize: '15px' }}>{`${propertyData.area} ${propertyData.areaUnit}`}</span>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>REGION</span><br/>
                              <span style={{ fontSize: '15px' }}>{capitalizeAllWords(`${propertyData.city}, ${propertyData.state}, `) + propertyData?.country?.toUpperCase()}</span>
                            </Col>
                            <Col md={6}>
                              <span style={{ fontSize: '12px', color:'grey' }}>ZIPCODE</span><br/>
                              <span style={{ fontSize: '16px', color:'black' }}>{propertyData.zip}</span>
                            </Col>
                          </Row>

                        </Col>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row style={{marginTop:'0.5rem'}}>
                  <Col md={12}>
                    <Card style={{fontSize:'15px', textAlign:'left'}}>
                      <Card.Body>{propertyData.description}</Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col md={3}>
                {
                  !tourRequested &&
                    <Card>
                      <Card.Title style={{textAlign:'left', 'marginTop':'0.5rem', 'marginLeft':'0.5rem'}}>Request a Tour</Card.Title>
                      <Card.Body style={{textAlign:'center'}}>
                        <DateTimePicker 
                          value={visitDate}
                          onChange={(value) => {setVisitDate(value)}}
                          minDate={oneDayAhead}
                          maxDate={twoWeeksAhead}
                          maxDetail="hour"
                          disabled={tourRequested}
                        />
                        <Button 
                          variant='primary'
                          size={'sm'}
                          style={{marginTop:'0.5rem'}}
                          onClick={() => requestTourCallback()}
                          disabled={tourRequested}
                        >
                          Request Tour
                        </Button>
                      </Card.Body>
                    </Card>
                }
                {
                  tourRequested &&
                    <Card style={{padding:'0.5rem'}}>
                      <h5>Tour requested. Our agent will reach out to your shortly!</h5>
                    </Card>
                }

              </Col>
              <Col md={2}/>
            </Row>

            <br/>

          </Container>
      }
      {
        isViewerOpen && 
          <ReactSimpleImageViewer
            src={propertyData.images || []}
            currentIndex={currentImage}
            onClose={closeImageViewer}
            disableScroll={true}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.9)"
            }}
            closeOnClickOutside={true}
          />
      }
    </div>
  );
};

export default ShowProperty;

