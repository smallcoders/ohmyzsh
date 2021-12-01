import { ReactNode } from 'react';
import './self-card.less';

const SelfCard = (props: {
  children?: ReactNode;
  title?: string | ReactNode;
  extra?: string | ReactNode;
}) => {
  const { extra, title, children } = props || {};
  return (
    <>
      <div className="self-card-header">
        <div>{title}</div> <div>{extra}</div>
      </div>
      <div className="self-card-body">{children}</div>
    </>
  );
};
export default SelfCard;
