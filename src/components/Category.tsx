import { useParams } from 'react-router-dom';

const Category = () => {
    const { catId } = useParams();

    return (
        <div className='flex h-full flex-row items-start justify-start'>
            {/* <div className='w-1 self-stretch bg-white' /> */}
            <div className='size-full bg-white'>{catId}</div>
        </div>
    );
};

export default Category;
