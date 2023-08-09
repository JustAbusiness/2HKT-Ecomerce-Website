import React from "react";
import { Schema, schema } from "src/utils/rules";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import path from "src/constants/path";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useQueryConfig from "src/hooks/useQueryConfig";
import { omit } from "lodash";

type FormData = Pick<Schema, "name">;
const nameSchema = schema.pick(["name"]);

export default function useSearchProduct() {

  const queryConfig = useQueryConfig();
  const { register, handleSubmit } = useForm<FormData>({
    // SUBMIT FORM TÌM KIẾM
    defaultValues: {
      name: ""
    },
    resolver: yupResolver(nameSchema)
  });

  const navigate = useNavigate();

  const onSubmitSearch = handleSubmit((data) => {
    // LOẠI BỎ TRƯỜNG HỢP TƯƠNG TÁC VS SORT PRODUCT
    const config = queryConfig?.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ["order", "sort_by"]
        )
      : {
          ...queryConfig,
          name: data.name
        };

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    });
  });
  return {onSubmitSearch, register,}
}
