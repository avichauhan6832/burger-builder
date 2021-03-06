import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.css';

class Auth extends Component{

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: '**********'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        }
    }

    checkValidation( value, rules ){

        let isValid = true;
        if( !rules ){
            return true;
        }

        if( rules.required ){
            isValid = value.trim() !== '' && isValid;
        }

        if( rules.minLength ){
            isValid = value.length >= rules.minLength && isValid;
        }

        if( rules.maxLength ){
            isValid = value.length <= rules.maxLength && isValid;
        }

        if( rules.isNumeric ){
            const pattern = /^\d+$/;
            isValid = pattern.test( value ) && isValid;
        }

        if( rules.isEmail ){
            const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            isValid = pattern.test( value ) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = ( event, controlName ) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[ controlName ],
                value: event.target.value,
                valid: this.checkValidation( event.target.value, this.state.controls[ controlName ].validation ),
                touched: true
            }
        }

        this.setState({
            controls: updatedControls
        });
    }

    render(){

        const formElementArray = [];

        for( let key in this.state.controls ){
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        const form = formElementArray.map(formElement => (
            <Input 
                key={ formElement.id }
                elementType={ formElement.config.elementType }
                elementConfig={ formElement.config.elementConfig }
                value={ formElement.config.value }
                invalid={ !formElement.config.valid }
                shouldValidate={ formElement.config.validation }
                touched={ formElement.config.touched }
                changed={ ( event ) =>  this.inputChangedHandler( event, formElement.id ) }
            />    
        ));

        return(
            <div className={ classes.Auth } >
                <form>
                    { form }
                    <Button btnType="Success">SUBMIT</Button>
                </form>
            </div>
        );
    }
}

export default  Auth; 