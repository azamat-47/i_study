import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'antd';

const CourseGroupDetail = () => {
    const { id } = useParams();

    return (
        <Card title="Guruh ma'lumotlari">
            <p>Guruh ID: {id}</p>
            {/* Bu yerda guruh haqidagi batafsil ma'lumotlar chiqadi */}
        </Card>
    );
};

export default CourseGroupDetail;