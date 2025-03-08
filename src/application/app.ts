import {Container} from "@tsclean/core";
import {controllers} from "@/infrastructure/entry-points/api";
import {services, adapters} from "@/infrastructure/driven-adapters/providers";

@Container({
    providers: [...services, ...adapters],
    controllers: [...controllers]
})

export class AppContainer {}
