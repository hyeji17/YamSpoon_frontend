import React, {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';
import './MaterialBar.scss'
import Carousel from "../../components/Carousel/Carousel";
import Ingredients from "../../utils/Ingredients";

const MaterialBar = ({ handleMaterialSelect, handleAllClick }) => {
    const [ selectedSub, setSelectedSub ] = useState(null);
    const [ categoryData, setCategoryData ] = useState(null)
    const [ subCategoryData, setSubCategoryData ] = useState(null)
    const [ filteredSub, setFilteredSub ] = useState(null)

    const carouselRef = useRef(null);

    const fetchCategory = async () => {
        try {
          const response = await Ingredients.getIngredientsCategory()
          const categories = response.data.map(item => item.category);
          setCategoryData(categories)
  
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
    };

    const fetchSubCategory = async() => {
        try {
            const response = await Ingredients.getIngredients()
            const subCategory = response.data
            setSubCategoryData(subCategory)
        } catch (error) {
            console.error('Error fetching subcat:', error)
        }
    }

    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
    }, [])

    const handleSubClick = (idx) => {
        setSelectedSub(selectedSub === idx ? null : idx);
        handleMaterialSelect(filteredSub[idx].id)
    };

    const handleSubSelect = (index) => {
        const value = `c${index+1}`
        const filteredArr = subCategoryData
                            .filter(item => item.categoryid === value)
        setFilteredSub(filteredArr)
        setSelectedSub(null)
    }

    const handleAllButtonClick = () => {
        handleAllClick()
        setSelectedSub(null)
        setFilteredSub(null)
        if (carouselRef.current && carouselRef.current.handleSelect) {
            carouselRef.current.handleSelect(-1);
        }
    }
   
    const items = 7;

    return (
        
        <div className='bar--container'>
            <div className="button--box">
                <button className="all" onClick={handleAllButtonClick}>전체</button>
                <div className='main--bar'>
                    {categoryData && <Carousel 
                                        ref={carouselRef} 
                                        CategoryData={categoryData} 
                                        items={items} 
                                        showDeleteButton={false} 
                                        handleSubSelect={handleSubSelect} />}
                </div>
            </div>
                
            <div className='sub--bar'>
                { filteredSub && filteredSub.map((item, idx) => (
                    <button
                        key={`${idx}-${item}`}
                        className={selectedSub === idx ? 'selected' : ''}
                        onClick={() => handleSubClick(idx)}
                    >
                    {item.name}
                    </button>
                ))}

            </div>
            
        </div>
    )
}

MaterialBar.propTypes = {
    handleMaterialSelect: PropTypes.func,
    handleAllClick: PropTypes.func,
    material: PropTypes.bool
}

export default MaterialBar