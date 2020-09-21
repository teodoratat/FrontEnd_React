import React from 'react';
import validate from "./validators/person-validators";
import TextInput from "./fields/TextInput";
import './fields/fields.css';
import Button from "react-bootstrap/Button";
import * as API_USERS from "./api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";


class PersonForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'What is your name?...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                email: {
                    value: '',
                    placeholder: 'Email...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        emailValidator: true
                    }
                },
                age: {
                    value: '',
                    placeholder: 'Age...',
                    valid: false,
                    touched: false,
                },
                address: {
                    value: '',
                    placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
                    valid: false,
                    touched: false,
                },
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = {
            ...this.state.formControls
        };

        const updatedFormElement = {
            ...updatedControls[name]
        };

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    };

    registerPerson(person) {
        return API_USERS.postPerson(person, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted person with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        let person = {
            name: this.state.formControls.name.value,
            email: this.state.formControls.email.value,
            age: this.state.formControls.age.value,
            address: this.state.formControls.address.value
        };

        console.log(person);
        this.registerPerson(person);
    }

    render() {
        return (
            <div>

                    <Row>
                        <Col>
                            <label> Name: </label>
                        </Col>
                        <Col sm={{size: '8'}}>
                            <TextInput name="name"
                                       placeholder={this.state.formControls.name.placeholder}
                                       value={this.state.formControls.name.value}
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.name.touched? 1 : 0}
                                       valid={this.state.formControls.name.valid? 1 : 0}/>
                        </Col>
                        {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                        <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                    </Row>

                    <Row>
                        <Col>
                            <label> Email: </label>
                        </Col>
                        <Col sm={{size: '8'}}>
                            <TextInput name="email"
                                       placeholder={this.state.formControls.email.placeholder}
                                       value={this.state.formControls.email.value}
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.email.touched? 1 : 0}
                                       valid={this.state.formControls.email.valid? 1 : 0} />
                        </Col>
                        {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                        <div className={"error-message"}> * Email must have a valid format</div>}
                    </Row>

                    <Row>
                        <Col>
                            <label> Address: </label>
                        </Col>
                        <Col sm={{size: '8'}}>
                            <TextInput name="address"
                                       placeholder={this.state.formControls.address.placeholder}
                                       value={this.state.formControls.address.value}
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.address.touched? 1 : 0}
                                       valid={this.state.formControls.address.valid? 1 : 0} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label> Age: </label>
                        </Col>
                        <Col sm={{size: '8'}}>
                            <TextInput name="age" pattern="[0-9]*"
                                       placeholder={this.state.formControls.age.placeholder}
                                       value={this.state.formControls.age.value}
                                       onChange={this.handleChange}
                                       touched={this.state.formControls.age.touched? 1 : 0}
                                       valid={this.state.formControls.age.valid? 1 : 0}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={{size: '4', offset: 8}}>
                            <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                        </Col>
                    </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default PersonForm;
