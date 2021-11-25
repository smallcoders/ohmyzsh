import './self-tag.less';

const getSelfTags = (
  options: { id?: string | number; name?: string }[],
  selected: string | number | undefined,
  onChange: (id: string) => void,
): React.ReactNode => {
  return options.map((p) => (
    <span
      key={p.id || '' + p.name}
      onClick={() => onChange(p.id as string)}
      className={p.id === selected ? 'tag tag-selected' : 'tag'}
    >
      {p.name}
    </span>
  ));
};
export default getSelfTags;
