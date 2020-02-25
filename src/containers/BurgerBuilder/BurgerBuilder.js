import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import * as burgerBuilderActions from '../../store/actions/index';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



class BurgerBuilder extends Component {

    state = {
        purchasing: false
    }

    componentDidMount() {
        // axios.get('https://react-burger-webapp-3fda0.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     })
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igkey => {
            return ingredients[igkey]
        }).reduce((sum,el) => sum + el, 0);
        return sum > 0
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        // alert('You Continue!');
        // this.setState({loading:true});
        // const order = {
        //     ingredients : this.state.ingredients,
        //     price : this.state.totalPrice,
        //     customer: {
        //         name : 'Avinash Chauhan',
        //         address: {
        //             street : 'TestStreet 1',
        //             zipCode : '382330',
        //             country : 'india'
        //         },
        //         email : 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({loading: false, purchasing: false});
        //     })
        //     .catch(err => {
        //         this.setState({loading: false, purchasing: false});
        //     }); 
        this.props.history.push('/checkout');
    }

    render() {

        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null; 

        let burger = this.props.error ? <p>Ingredients can not be loaded!</p> :<Spinner />

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={this.props.price} 
                    purchasable={this.updatePurchaseState( this.props.ings ) }
                    ordered={this.purchaseHandler}/> 
                </Aux>
            );
            
            orderSummary = <OrderSummary
            purchaseCanceled={this.purchaseCancelHandler}
            price={this.props.price}
            purchaseContinued={this.purchaseContinueHandler} 
            ingredients={this.props.ings}/> 
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {

    return {

        onIngredientAdded: ( ingName ) => dispatch( burgerBuilderActions.addIngredient( ingName ) ), 

        onIngredientRemoved: ( ingName ) => dispatch( burgerBuilderActions.removeIngredient( ingName ) ),
        onInitIngredients: () => dispatch( burgerBuilderActions.initIngredients() )
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler(BurgerBuilder, axios ));