import { Box, Button, Stack, Typography } from "@mui/material";
import { PARTS_CATALOG, type PartType } from "../three/PartsFactory";

type Props = {
    onAddPart: (type: PartType) => void;
};

export const Sidebar = ({ onAddPart }: Props) => {
    return (
        <Box
            component="aside"
            sx={{
                width: 240,
                flexShrink: 0,
                height: "100%",
                borderRight: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                p: 2,
            }}
        >
            <Typography variant="h6" gutterBottom>
                Parts
            </Typography>
            <Stack spacing={1}>
                {PARTS_CATALOG.map((part) => (
                    <Button
                        key={part.type}
                        variant="outlined"
                        onClick={() => onAddPart(part.type)}
                    >
                        {part.label}
                    </Button>
                ))}
            </Stack>
        </Box>
    );
};
