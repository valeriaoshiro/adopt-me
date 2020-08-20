import React from "react";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
import ThemeContext from "./ThemeContext";
import Modal from "./Modal";
import { Client } from "@petfinder/petfinder-js";

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, showModal: false };
  }
  componentDidMount() {
    let petFinder = new Client({
      apiKey: process.env.REACT_APP_PET_FINDER_API_KEY,
      secret: process.env.REACT_APP_PET_FINDER_SECRET,
    });

    petFinder.animal
      .show(Number(this.props.match.params.id))
      .then(({ data: { animal } }) => {
        this.setState({
          name: animal.name,
          animal: animal.type,
          location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
          description: animal.description,
          media: animal.photos,
          breed: animal.breeds.primary,
          loading: false,
          url: animal.url,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  adopt = () => {
    window.location = this.state.url;
  };

  toggleModal = () => {
    return this.setState({ showModal: !this.state.showModal });
  };

  render() {
    if (this.state.loading) {
      return <h2>loading ...</h2>;
    }

    if (this.state.error) {
      return <h2>Pet not found</h2>;
    }

    const {
      animal,
      breed,
      location,
      description,
      media,
      name,
      showModal,
    } = this.state;

    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${location}`}</h2>
          <ThemeContext.Consumer>
            {([theme]) => {
              return (
                <button
                  style={{ background: theme }}
                  onClick={this.toggleModal}
                >
                  Adopt {name}
                </button>
              );
            }}
          </ThemeContext.Consumer>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <div>
                <h1>Would you like to adopt {name}?</h1>
                <div className="buttons">
                  <button onClick={this.adopt}>Yes</button>
                  <button onClick={this.toggleModal}>No</button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
