import cornlogo from '@/images/logos/corn.png';
import Image from 'next/image';

export function Logo(props) {
  return (
    <Image 
      src={cornlogo} 
      alt="Corn Logo" 
      {...props} 
      style={{ width: '200', height: '60px' }} 
    />
  );
}
