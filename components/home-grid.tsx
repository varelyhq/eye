import { CamType } from "@/types/cam-type";
import { Grid } from "./ui/grid";
import { Cam } from "./cam";

export function HomeGrid({ cams }: { cams: CamType[] }) {

    return (
        <Grid className="grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {cams.map(cam => <Cam key={cam.id} cam={cam} />)}
        </Grid>
    )
}
