import { Button, Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { capitalizeFirstLetter, formatNumberWithCommas } from '../utils/stringTransformers';
import { useEffect, useState } from 'react';

import { RealEstateProperty } from '../interfaces/realEstateProperty';
import { getPropertyByID } from '../services/propertiesService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ShowProperty = () => {
  const { propertyID } = useParams();
  const [propertyData, setPropertyData] = useState<RealEstateProperty>({} as RealEstateProperty);

  useEffect(() => {
    if (!propertyID) {
      toast.error('Property ID Missing!');
      return;
    } else {
      toast.info(`Fetching Property with ID: ${propertyID}`);
    }

    getPropertyByID(parseInt(propertyID || '')).then((response) => {
      setPropertyData(response.data);
    });
  }, [propertyID]);

  return (
    <div style={{backgroundColor: '#eeeeee', height: '100%' }}>
      { propertyData && 
        <Container fluid={true}>
          <Row style={{padding:'0.5rem', marginBottom:'0.5rem', position: 'sticky', top: 0, zIndex:1, backgroundColor: '#eeeeee', }}>
            <Col md={2}/>
            <Col md={8} style={{textAlign:'left'}}>
              <div>
                <h4 style={{marginBottom:'0.5rem'}}>{propertyData.address}</h4>
                {
                  propertyData?.propertyType &&                 
                    <Button variant='secondary' disabled={true} size='sm' style={{width:'fit-content'}}>
                      <b>{capitalizeFirstLetter(propertyData.propertyType)}</b>
                    </Button>
                }

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
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
          
          <Row style={{textAlign:'left', marginTop:'0.5rem', marginLeft:'0.5rem'}}>
            <Col md={2}/>
            <Col md={8}>
              {
                propertyData?.price && 
                  <u><b><h2>{`${propertyData.currencySymbol}${formatNumberWithCommas(propertyData.price.toString())}`}</h2></b></u>
              }
            </Col>
            <Col md={2}/>
          </Row>

          <Row style={{marginTop:'0.5rem'}}>
            <Col md={2} />
            <Col md={5}>
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
            
            <Col md={5}/>
          </Row>
          <Row style={{marginTop:'0.5rem'}}>
            <Col md={2}/>
            <Col md={5}>
              <Card style={{textAlign:'left', padding:'1rem'}}>
                <Card.Body>{propertyData.description}</Card.Body>
              </Card>
            </Col>
            <Col md={5}/>
          </Row>
          <br/>
        </Container>
      }
    </div>
  );
};

export default ShowProperty;

