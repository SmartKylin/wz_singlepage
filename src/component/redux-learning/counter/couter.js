import React, {Component} from 'react'
import PropTypes from 'prop-types'
import * as Actions from './action'
import {bindActionCretors} from 'redux'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  value: state
})

@connect(mapStateToProps, {...Actions})

export default class extends Component {
  incrementIfOdd = () => {
    let {increment} = this.props
    if (this.props.value % 2 !== 0) {
     increment()
    }
  }
  
  incrementAsync = () => {
    let {increment} = this.props
    setTimeout(increment, 1000)
  }
  
  render () {
    const {value, increment, decrement} = this.props
    
    return (
      <p style={{marginTop: '100px', display: 'flex', justifyContent: 'center'}}>
        Clicked: {value} times
        {' '}
        <Button bsStyle="primary" onClick={increment}>
          +
        </Button>
        {' '}
        <Button bsStyle="primary" onClick={decrement}>
          -
        </Button>
        {' '}
        <Button bsStyle="primary" onClick={this.incrementIfOdd}>
          Increment if odd
        </Button>
        {' '}
        <Button bsStyle="primary" onClick={this.incrementAsync}>
          Increment async
        </Button>
      </p>
    )
  }
}