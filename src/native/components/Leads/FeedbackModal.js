import React, { Component } from 'react';
import { Modal, Text, Button, Container, Content, H1 } from 'native-base';

const FeedBackModal = () => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            >
                <Container padder>
                    <Content padder>
                        <Text>Provide feedback about</Text>
                        <H1>Vishwa</H1>
                        <Text>+9198286t8273</Text>
                        <Button>
                            <Text>Done</Text>
                        </Button>
                    </Content>
                </Container>
            </Modal>
    )
}

export default FeedBackModal;

