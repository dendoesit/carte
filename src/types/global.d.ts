declare module 'react-helmet-async' {
  import * as React from 'react'
  
  export interface HelmetProps {
    defer?: boolean
    encodeSpecialCharacters?: boolean
    children?: React.ReactNode
  }
  
  export class Helmet extends React.Component<HelmetProps> {}
  export class HelmetProvider extends React.Component<{ children: React.ReactNode }> {}
}

declare module 'html2canvas' {
  const html2canvas: any
  export default html2canvas
}

declare module 'jspdf' {
  const jsPDF: any
  export { jsPDF }
} 