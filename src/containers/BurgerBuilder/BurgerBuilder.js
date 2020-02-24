import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIETS_PRICES = {
    salad: 0.5,
    cheese: 0.3,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice : 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-burger-webapp-3fda0.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true})
            })
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igkey => {
            return ingredients[igkey]
        }).reduce((sum,el) => sum + el, 0);

        this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIETS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPirce = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPirce,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
            return;
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIETS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPirce = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPirce,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);        
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
        const queryParams = [];

        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null; 

        let burger = this.state.error ? <p>Ingredients can not be loaded!</p> :<Spinner />

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice} 
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}/> 
                </Aux>
            );
            
            orderSummary = <OrderSummary
            purchaseCanceled={this.purchaseCancelHandler}
            price={this.state.totalPrice}
            purchaseContinued={this.purchaseContinueHandler} 
            ingredients={this.state.ingredients}/> 
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
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

export default withErrorHandler(BurgerBuilder, axios);