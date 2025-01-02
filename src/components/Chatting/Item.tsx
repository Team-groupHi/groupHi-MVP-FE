interface ItemProps {
  sender: string;
  content: string;
  index: number;
  type: 'system' | 'me' | 'others';
}

const Item = ({ sender, content, index, type }: ItemProps) => {
  return (
    <div
      className={`${index === 0 ? 'rounded-t-lg' : ''} p-3 
        ${
          type == 'system'
            ? 'bg-primary/20'
            : index % 2 === 0
              ? 'bg-container-600'
              : 'bg-white/10'
        } 
        ${type !== 'others' ? 'text-primary-400' : ''}`}
    >
      {type == 'system' ? (
        <span className="font-semibold">{content}</span>
      ) : (
        <div>
          <span className="font-semibold">{sender}</span>
          {`: `}
          <span>{content}</span>
        </div>
      )}
    </div>
  );
};

export default Item;