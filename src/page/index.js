import {createRouter} from '../core/core';
import Homepage from "./Homepage"
import Aboutpage from './aboutpage'

export default createRouter([
    {path:'#/' , component:Homepage},
    {path:"#/about",component:Aboutpage},
]);