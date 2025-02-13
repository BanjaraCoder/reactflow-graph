import { getColorClass } from '../../colormap';

const Button = ({
  children,
  nodeType,
  onClick,
}: {
  children: React.ReactNode;
  nodeType: string;
  onClick?: () => void;
}) => {
  const bgColor = getColorClass(nodeType) || 'bg-gray-400'; // Default to gray if no color is defined

  return (
    <span
      className={`inline-block px-2 rounded-full text-sm font-semibold ${bgColor} text-white mr-2 mb-2 cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Button;
