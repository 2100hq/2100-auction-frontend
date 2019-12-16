import styled from 'styled-components'
import {
  borderRadius,
  space,
  width,
  color,
  order,
  position,
  top,
  margin,
  right,
  bottom,
  left,
  size,
  textAlign,
  minWidth,
  maxWidth,
  maxHeight,
  minHeight,
  border,
  height,
  alignItems,
  flex,
  flexGrow,
  flexDirection,
  flexWrap,
  justifyContent
} from 'styled-system'

export const Box = styled.div`
  box-sizing: border-box;
  ${borderRadius}
  ${border}
  ${color}
  ${order}
  ${position}
  ${top}
  ${right}
  ${bottom}
  ${left}
  ${space}
  ${textAlign}
  ${size}
  ${width}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${height}
  ${maxHeight}
  ${margin}
`

Box.displayName='Box'

export const Flex = styled(Box)`
  display:flex;
  ${alignItems}
  ${flex}
  ${flexDirection}
  ${flexWrap}
  ${justifyContent}
  ${flexGrow}
`
Flex.displayName='Flex'

export const ApplePanel = styled(Box)`
  background-color:#d3d3d340;
  border-radius:50px 50px 50px 50px;
  border:1px solid #dee2e6;
  padding-left:20px;
  padding-right:20px;
  padding-top:5px;
  padding-bottom:5px;
`

export const Vr = styled.div`
  width:1px;
  height:95%;
  border-left:1px solid rgba(0,0,0,.1);
  margin:0;
`

export const Hr = styled.hr`
  width:95%;
  margin:0;
`


export const BurnInput = styled.input`
  // border-radius: 0 50px 50px 0;
  // border-radius: 50px 50px 50px 50px;
  width:150px;
  height:35px;
  border-width:0px;
  border-bottom-width:2px;
  // background-color:#e5ff9f;
  disabled:${props=>props.disabled};
`

export const BurnButton = styled.button`
  border-radius: 50px 50px 50px 50px;
  height:35px;
  width:150px;
  padding:0;
  disabled:${props=>props.disabled};
  // border-width:0;
`

export const UnitButton = styled.div`
  // border-radius: 0 50px 50px 0;
  // background-color:#e5ff9f
  margin:10px;
  height:35px;
  // width:100px;
  padding:0;
  border-width:0;
`

export const P = styled.p`
  margin:0;
`

export const Small = styled(P)`
  font-size:.85rem;
`

export const Tiny = styled(P)`
  font-size:.7rem;
`

export const Strong = styled.strong`

`

