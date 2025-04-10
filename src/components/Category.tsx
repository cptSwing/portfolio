import { useParams } from 'react-router-dom';

const Category = () => {
    const { catId } = useParams();

    return (
        <div className='flex flex-row items-start justify-start'>
            <div className='w-1 self-stretch bg-white' />
            <div className='h-full w-2/3 bg-red-300'>{catId}</div>
        </div>
    );
};

export default Category;
