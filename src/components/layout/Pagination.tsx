import {Box} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {Pagination as MuiPagination} from "@mui/material";

interface PaginationProps {
  pagesCount: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>
}
export default function Pagination({pagesCount, page, setPage}: PaginationProps) {
  return (
    <>
      {
        pagesCount > 1 &&
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
          <MuiPagination
            count={pagesCount}
            page={page}
            onChange={(e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage)}
            boundaryCount={2}
            siblingCount={2}
            color="secondary"
            variant="outlined"
          />
        </Box>
      }
    </>
  );
}