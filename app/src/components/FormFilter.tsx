import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Button, Form, InputGroup } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppContent, ContextApp, ICard } from '../App';

interface ILabelArrhytmia {
  label: string;
  value: string;
}

const FormFilter = (props: any) => {
  const contextAppValue = useContext<AppContent>(ContextApp);

  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [categoriesArrhythmias, setCategoriesArrhythmias] = useState<
    ILabelArrhytmia[]
  >([]);

  const cardsDisplayed = contextAppValue.cardsDisplayed;
  const setCardsDisplayed = contextAppValue.setCardsDisplayed;

  useEffect(() => {
    let listArrhytmias: string[] = [];
    cardsDisplayed.forEach((c: ICard) => {
      c.arrhythmias.forEach((a: string) => {
        if (!listArrhytmias.includes(a)) {
          listArrhytmias.push(a);
        }
      });
    });
    setCategoriesArrhythmias(
      listArrhytmias.map((a: string) => ({ label: a, value: a })),
    );
  }, [cardsDisplayed]);

  return (
    <Formik
      // Valeurs initiales
      initialValues={{
        keyword: currentKeyword,
        category: currentCategory,
      }}
      // Vérification pour les champs
      validationSchema={() =>
        Yup.object().shape({
          keyword: Yup.string().optional(),
          category: Yup.string().required('Veuillez selectionner la catégorie'),
        })
      }
      // Lors du submit
      onSubmit={(values) => {
        let patientName = values.keyword;
        let arrhythmia = values.category;
        setCurrentKeyword(patientName);
        setCurrentCategory(arrhythmia);

        for (let i = 0; i < cardsDisplayed.length; i++) {
          let nameMatch = new RegExp(patientName).test(
            cardsDisplayed[i].patient_name,
          );

          if (arrhythmia === 'all') {
            cardsDisplayed[i].display = nameMatch;
          } else {
            let test1 = patientName === '' ? true : nameMatch;
            let test2 = cardsDisplayed[i].arrhythmias.find(
              (name) => name === arrhythmia,
            )
              ? true
              : false;
            cardsDisplayed[i].display = test1 && test2;
          }
        }

        setCardsDisplayed([...cardsDisplayed]);
      }}
    >
      {({
        errors,
        touched,
        values,
        handleSubmit,
        handleChange,
        setFieldValue,
      }) => (
        <Form>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col>
              <InputGroup className='mb-3'>
                <Form.Control
                  name='keyword'
                  type='text'
                  placeholder='Patient name'
                  onChange={(e) => {
                    setFieldValue('keyword', e.target.value);
                  }}
                  value={values.keyword}
                  isInvalid={touched.keyword && !!errors.keyword}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.keyword}
                </Form.Control.Feedback>

                <Form.Control
                  name='category'
                  as='select'
                  onChange={(e) => {
                    setFieldValue('category', e.target.value);
                  }}
                  value={values.category}
                >
                  <option value='all'>Tous</option>
                  {categoriesArrhythmias.map((option, index) => {
                    return (
                      <option
                        key={`option-${index}`}
                        value={option.value}
                      >
                        {option.label || option.value}
                      </option>
                    );
                  })}
                </Form.Control>

                <Button
                  variant='primary'
                  id='button-addon2'
                  type='submit'
                  onClick={(e?: any): void => {
                    handleSubmit(e);
                  }}
                >
                  Filtrer
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default FormFilter;
