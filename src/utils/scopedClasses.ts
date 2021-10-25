interface AttributeInterface {
  [propsName: string]: boolean;
}

const scopedClasses =
  (prefixClassName: string) =>
  (name: AttributeInterface | string = '') => {
    if (name instanceof Object) {
      return Object.entries(name)
        .filter((item) => item[1])
        .map((item) => item[0])
        .map((item) => [prefixClassName, item].join('-'))
        .join(' ');
    }
    return [prefixClassName, name].filter(Boolean).join('-');
  };

// export const labelStyle = {
//   width: '183px',
//   justifyContent: 'flex-end',
//   fontSize: '16px',
//   color: 'rgba(0, 0, 0, 0.65)',
// }

// export const contentStyle = {
//   fontSize: '16px',
//   color: 'rgba(0,0,0,0.85)',
// }

// export const companyLabelStyle = {
//   width: '150px',
//   justifyContent: 'flex-end',
//   fontSize: '16px',
//   color: 'rgba(0, 0, 0, 0.65)',
//   alignItems: 'center',
// }

// export const companyContentStyle = {
//   fontSize: '16px',
//   color: 'rgba(0,0,0,0.85)',
//   fontWeight: 700,
//   alignItems: 'center',
// }

export default scopedClasses;
