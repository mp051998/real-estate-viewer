import { Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

import { RealEstateProperty } from '../interfaces/property';

const dummyPropertyData: RealEstateProperty =   { 
  id: 1, 
  name: 'Property 1', 
  price: '$100,000', 
  propertyType: 'Bungalow', 
  locality: 'XYZ', 
  state: 'California', 
  area: '2000 sqft', 
  bedrooms: '2bhk',
  images: [
    '/home-06.jpg',
    '/logo.png',
    '/home-06.jpg',
    '/home-06.jpg',
    '/home-06.jpg',
  ],
  description: `Non voluptate magna cupidatat duis mollit aliqua non. Sunt officia irure quis ut deserunt. Nostrud occaecat voluptate cupidatat tempor fugiat consequat laborum excepteur labore voluptate eu duis aute. Esse fugiat ut aute veniam pariatur et aute in sit magna et esse do proident. Culpa dolor officia velit nisi excepteur enim pariatur proident reprehenderit ea laboris cupidatat. Eiusmod est sunt non cupidatat duis enim cupidatat non aliqua nulla incididunt ut nostrud.
    Amet voluptate fugiat mollit amet. Quis elit ex non in aliquip culpa. Est ullamco Lorem sit proident Lorem ut veniam minim aliquip duis minim dolore in consequat. Incididunt est do nostrud aliqua proident ut sunt. Nisi ea cupidatat qui occaecat ex incididunt culpa ex excepteur.
    Ad fugiat dolor eu sint. Ea adipisicing laboris nostrud reprehenderit aute dolor irure deserunt labore amet occaecat irure ullamco. Officia officia nisi ea non. Excepteur eu esse exercitation veniam nostrud sunt cillum elit commodo dolore esse adipisicing commodo enim. Ex anim nulla labore reprehenderit elit velit do. Incididunt occaecat in esse qui anim deserunt ex reprehenderit. Eiusmod quis reprehenderit Lorem in Lorem ea nostrud mollit veniam velit aliqua deserunt velit.
    Nulla voluptate aliquip occaecat exercitation mollit Lorem dolore. Anim commodo occaecat commodo enim est in commodo ullamco culpa est do eiusmod. Nisi qui dolor quis tempor minim. Ut Lorem commodo fugiat minim consectetur cillum voluptate exercitation pariatur sunt excepteur. Velit ullamco proident ut dolor. Sunt nulla est fugiat aute deserunt incididunt id nulla consectetur. Excepteur ad proident est eu est id dolor velit in consequat labore exercitation irure Lorem.
    Veniam eu fugiat dolore sunt adipisicing mollit magna aliquip veniam reprehenderit excepteur ipsum culpa. Ullamco cupidatat quis anim exercitation cupidatat pariatur. Sit occaecat sunt esse in excepteur dolor. Esse amet laboris laborum qui fugiat reprehenderit. Aliquip consequat mollit aliqua elit.
    Ipsum labore laborum officia excepteur. Incididunt enim nulla nulla culpa occaecat deserunt dolore aliqua Lorem nisi irure esse deserunt sunt. Dolor anim laborum consequat sunt magna voluptate nulla minim laborum excepteur velit ut. Adipisicing pariatur velit voluptate Lorem anim incididunt minim in proident minim quis non veniam sunt.
    Amet voluptate fugiat mollit amet. Quis elit ex non in aliquip culpa. Est ullamco Lorem sit proident Lorem ut veniam minim aliquip duis minim dolore in consequat. Incididunt est do nostrud aliqua proident ut sunt. Nisi ea cupidatat qui occaecat ex incididunt culpa ex excepteur.
    Ad fugiat dolor eu sint. Ea adipisicing laboris nostrud reprehenderit aute dolor irure deserunt labore amet occaecat irure ullamco. Officia officia nisi ea non. Excepteur eu esse exercitation veniam nostrud sunt cillum elit commodo dolore esse adipisicing commodo enim. Ex anim nulla labore reprehenderit elit velit do. Incididunt occaecat in esse qui anim deserunt ex reprehenderit. Eiusmod quis reprehenderit Lorem in Lorem ea nostrud mollit veniam velit aliqua deserunt velit.
    Nulla voluptate aliquip occaecat exercitation mollit Lorem dolore. Anim commodo occaecat commodo enim est in commodo ullamco culpa est do eiusmod. Nisi qui dolor quis tempor minim. Ut Lorem commodo fugiat minim consectetur cillum voluptate exercitation pariatur sunt excepteur. Velit ullamco proident ut dolor. Sunt nulla est fugiat aute deserunt incididunt id nulla consectetur. Excepteur ad proident est eu est id dolor velit in consequat labore exercitation irure Lorem.
    Veniam eu fugiat dolore sunt adipisicing mollit magna aliquip veniam reprehenderit excepteur ipsum culpa. Ullamco cupidatat quis anim exercitation cupidatat pariatur. Sit occaecat sunt esse in excepteur dolor. Esse amet laboris laborum qui fugiat reprehenderit. Aliquip consequat mollit aliqua elit.
    Ipsum labore laborum officia excepteur. Incididunt enim nulla nulla culpa occaecat deserunt dolore aliqua Lorem nisi irure esse deserunt sunt. Dolor anim laborum consequat sunt magna voluptate nulla minim laborum excepteur velit ut. Adipisicing pariatur velit voluptate Lorem anim incididunt minim in proident minim quis non veniam sunt.`,
}

const ShowProperty = () => {
  const [propertyData, setPropertyData] = useState<RealEstateProperty>(dummyPropertyData);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/api/property/${propertyID}`);
  //       const data = await response.json();
  //       setPropertyData(data);
  //     } catch (error) {
  //       console.error('Error fetching property data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [propertyID]);

  return (
    
    <div style={{backgroundColor: '#eeeeee', height: '100%' }}>
      <Container style={{padding:'1rem'}}>
        <Row>
          <Col md={12}>
            {/* Add your carousel component here */}
            <Carousel variant='primary' style={{ zIndex:0, height:'60vh', backgroundColor:'black' }}>
              {dummyPropertyData.images.map((image, index) => (
                <Carousel.Item key={index} >
                  <img
                    src={image}
                    alt={`Property ${index}`}
                    style={{ maxHeight: '60vh', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => {
                      console.log("Set images src: ", dummyPropertyData.images);
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        <br/>
        <Row style={{ position: 'sticky', top: 0, zIndex:99999 }}>
          <Col md={1} />
          <Col md={8}>
            <Card style={{ textAlign: 'left', padding: '0.75rem', height: '12vh' }}>
              <h1>{dummyPropertyData.name}</h1>
            </Card>
          </Col>
          <Col md={2}>
            <Card style={{ height: '12vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h3>{dummyPropertyData.price}</h3>
            </Card>
          </Col>
          <Col md={1} />
        </Row>
        <br/>
        <Row>
          <Col md={1} />
          <Col md={8}>
            <Card style={{ textAlign: 'left' }}>
              <Card.Header>
                <Card.Title>Overview</Card.Title>
              </Card.Header>
              <Card.Body>
                <Container>
                  <Row>
                    <Col md={3}>
                      <b>Type: </b>{dummyPropertyData.propertyType}
                    </Col>
                    <Col md={3}>
                      <b>Locality: </b>{dummyPropertyData.locality}
                    </Col>
                    <Col md={3}>
                      <b>Area: </b>{dummyPropertyData.area}
                    </Col>
                    <Col md={3}>
                      <b>Rooms: </b>{dummyPropertyData.bedrooms}
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
              <br/>
            </Card>
          </Col>
          <Col md={3}/>
        </Row>
        <br/>
        <Row>
          <Col md={1}/>
          <Col md={8}>
            <Card style={{textAlign:'left', padding:'1rem'}}>
              <Card.Body>{dummyPropertyData.description}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShowProperty;

