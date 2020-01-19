import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  ButtonGroup,
  Container,
  Collapse,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Nav,
  Navbar,
  NavbarToggler
} from "reactstrap";
import PropTypes from "prop-types";
import { getDiary } from "../actions/diaryActions";
import { loadUser } from "../actions/authActions";
import DeleteDiaryModal from "./DeleteDiaryModal";
import { decryptContent } from "../encryption";

class DiaryView extends React.Component {
  state = {
    isOpen: false,
    secret: "secret"
  };

  static propTypes = {
    match: PropTypes.object,
    params: PropTypes.object,
    getDiary: PropTypes.func,
    diary: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    fetchDiary: PropTypes.func
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    const { secret } = this.state;
    this.props.getDiary(params.id, secret);
  }

  render() {
    const {
      match: { params },
      diary
    } = this.props;
    const { secret } = this.state;

    return (
      <Container>
        {diary && (
          <Card>
            <Navbar light expand="sm" className="mt-2 mr-0">
              <NavbarToggler
                className="view-function-toggle"
                onClick={this.toggle}
              />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <ButtonGroup>
                    <Link to={`${params.id}/edit`}>
                      <Button>Edit</Button>
                    </Link>
                    <Link to="#">
                      <DeleteDiaryModal diaryID={params.id} />
                    </Link>
                    <Link to="/">
                      <Button>Home</Button>
                    </Link>
                  </ButtonGroup>
                </Nav>
              </Collapse>
            </Navbar>
            <CardBody>
              <p>
                {new Date(diary.date).toDateString()}{" "}
                {new Date(diary.date).toLocaleTimeString()}
              </p>

              <CardTitle className="diary-title">{diary.title}</CardTitle>
              <CardText tag="div">
                <div
                  dangerouslySetInnerHTML={{
                    __html: decryptContent(diary.body, secret)
                  }}
                />
              </CardText>
            </CardBody>
          </Card>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  diary: state.diary.diary,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => {
  return {
    getDiary: id => dispatch(getDiary(id))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DiaryView)
);
