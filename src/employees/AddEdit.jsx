import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { employeeService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    // form validation rules 
    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required('Full Name is required'),
        picture: Yup.string()
            .required('Picture is required'),
        job: Yup.string()
            .required('Job is required'),
        salary: Yup.string()
            .required('Salary is required'),
        status: Yup.string()
            .required('Status is required'),
        contractDate: Yup.string()
            .required('Contract Date is required')
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        console.log(data);
        data = buildBodyRequest(data);
        console.log(data);
        return isAddMode
            ? createEmployee(data)
            : updateEmployee(id, data);
    }

    function createEmployee(data) {
        return employeeService.create(data)
            .then(() => {
                alertService.success('Employee added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateEmployee(id, data) {
        return employeeService.update(id, data)
            .then(() => {
                alertService.success('Employee updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    function buildBodyRequest(data){
        const {BfullName, Brelationship, Bbirthday, Bgender, ...employee} = data;
        employee.contractDate = new Date(employee.contractDate).toISOString();
        const beneficiary = {
            fullName : BfullName,
            relationship : Brelationship,
            birthday : new Date(Bbirthday).toISOString(),
            gender : Bgender
        }
        employee.beneficiary = beneficiary
        return employee;
    }

    useEffect(() => {
        if (!isAddMode) {
            // get user and set form fields
            employeeService.getById(id).then(employee => {
                const fields = ['fullName', 'picture', 'job', 'salary', 'status', 'contractDate'];
                const Bfields = ['BfullName', 'Brelationship', 'Bbirthday', 'Bgender'];
                fields.forEach(field => setValue(field, employee[field]));
                Bfields.forEach(Bfield => setValue(Bfield, employee.beneficiary[Bfield.slice(1)]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add Employee' : 'Edit Employee'}</h1>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Full Name</label>
                    <input name="fullName" type="text" ref={register} className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.fullName?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Picture</label>
                    <input name="picture" type="text" ref={register} className={`form-control ${errors.picture ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.picture?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Job</label>
                    <input name="job" type="text" ref={register} className={`form-control ${errors.job ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.job?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Salary </label>
                    <input name="salary" type="number" ref={register} className={`form-control ${errors.salary ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.salary?.message}</div>
                </div>
                {/* <div className="form-group col">
                    <label>Role</label>
                    <select name="role" ref={register} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <div className="invalid-feedback">{errors.role?.message}</div>
                </div> */}
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Status</label>
                    <input name="status" type="text" ref={register} className={`form-control ${errors.status ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.status?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Contract Date </label>
                    <input name="contractDate" type="date" ref={register} className={`form-control ${errors.contractDate ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.contractDate?.message}</div>
                </div>
            </div>
            {/* {!isAddMode &&
                <div>
                    <h3 className="pt-3">Change Password</h3>
                    <p>Leave blank to keep the same password</p>
                </div>
            } */}
            {/* <div className="form-row">
                <div className="form-group col">
                    <label>Password</label>
                    <input name="password" type="password" ref={register} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Confirm Password</label>
                    <input name="confirmPassword" type="password" ref={register} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
            </div> */}


            <div className="form-row">
                <div className="form-group col-7">
                    <label>Full Name</label>
                    <input name="BfullName" type="text" ref={register} className={`form-control ${errors.BfullName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.BfullName?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Relationship</label>
                    <input name="Brelationship" type="text" ref={register} className={`form-control ${errors.Brelationship ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.Brelationship?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Birthday</label>
                    <input name="Bbirthday" type="date" ref={register} className={`form-control ${errors.Bbirthday ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.Bbirthday?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Gender</label>
                    <select name="Bgender" ref={register} className={`form-control ${errors.Bgender ? 'is-invalid' : ''}`}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="PreferNotToSay">Prefer Not To Say</option>
                    </select>
                    <div className="invalid-feedback">{errors.Bgender?.message}</div>
                </div> 
            </div>


            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}

export { AddEdit };