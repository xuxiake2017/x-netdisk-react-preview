import React from 'react';
import PropTypes from "prop-types";
import { useTheme } from '@material-ui/core/styles';
import styled from 'styled-components'
import {
    Circle as CircleLoading,
    Default as DefaultLoading,
    DualRing as DualRingLoading,
    Ellipsis as EllipsisLoading,
    Facebook as FacebookLoading,
    Grid as GridLoading,
    Heart as HeartLoading,
    Hourglass as HourglassLoading,
    Orbitals as OrbitalsLoading,
    Ring as RingLoading,
    Ripple as RippleLoading,
    Roller as RollerLoading,
    Spinner as SpinnerLoading,
    Ouroboro as OuroboroLoading,
} from 'react-spinners-css';

const LoadingContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 20%;
    margin: 40px 0;
`

const Loading = ({ type, color, size }) => {
    const theme = useTheme()
    if (!color) {
        color = theme.palette.primary.main
    }
    const props_ = {
        color,
        size
    }
    return (
        <LoadingContainer>
            {
                type === 'Default' && (
                    <DefaultLoading {...props_}/>
                )
            }
            {
                type === 'Circle' && (
                    <CircleLoading {...props_}/>
                )
            }
            {
                type === 'DualRing' && (
                    <DualRingLoading {...props_}/>
                )
            }{
                type === 'Ellipsis' && (
                    <EllipsisLoading {...props_}/>
                )
            }{
                type === 'Facebook' && (
                    <FacebookLoading {...props_}/>
                )
            }{
                type === 'Grid' && (
                    <GridLoading {...props_}/>
                )
            }{
                type === 'Heart' && (
                    <HeartLoading {...props_}/>
                )
            }{
                type === 'Hourglass' && (
                    <HourglassLoading {...props_}/>
                )
            }{
                type === 'Orbitals' && (
                    <OrbitalsLoading {...props_}/>
                )
            }{
                type === 'Ring' && (
                    <RingLoading {...props_}/>
                )
            }{
                type === 'Ripple' && (
                    <RippleLoading {...props_}/>
                )
            }{
                type === 'Roller' && (
                    <RollerLoading {...props_}/>
                )
            }{
                type === 'Spinner' && (
                    <SpinnerLoading {...props_}/>
                )
            }{
                type === 'Ouroboro' && (
                    <OuroboroLoading {...props_}/>
                )
            }
        </LoadingContainer>
    )
}

Loading.defaultProps = {
    type: 'Default',
    color: '',
    size: 100
}

Loading.propTypes = {
    type: PropTypes.oneOf([
        'Circle', 'Default', 'DualRing', 'Ellipsis', 'Facebook', 'Grid', 'Heart', 'Hourglass', 'Orbitals', 'Ring', 'Ripple', 'Roller', 'Spinner', 'Ouroboro'
    ]),
    color: PropTypes.string,
    size: PropTypes.number,
}

export default Loading;
