import { NewDeviceService } from "./newdevice.service"
import { Test, TestingModule } from '@nestjs/testing';

describe('NewDeviceService', () => {
    let service: NewDeviceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [NewDeviceService],
        }).compile();
    
        service = module.get<NewDeviceService>(NewDeviceService);
      });
    
      it('should be defined', () => {
        expect(service).toBeDefined();
      });
});