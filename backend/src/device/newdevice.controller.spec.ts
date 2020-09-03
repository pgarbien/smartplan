import { NewDeviceController } from "./newdevice.controller"
import { Test, TestingModule } from '@nestjs/testing';

describe('NewDevice Controller', () => {
    let controller: NewDeviceController;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [NewDeviceController],
        }).compile();
    
        controller = module.get<NewDeviceController>(NewDeviceController);
      });
    
      it('should be defined', () => {
        expect(controller).toBeDefined();
      });
});